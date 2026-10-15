import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * MenuService：动态路由（/getRouters）业务
 * 对应若依 SysLoginController.getRouters → selectMenuTreeByUserId + buildMenus
 * 逻辑：
 *   1. admin 角色 → 返回全部可见菜单；普通用户 → 走五表联动按角色查，去重
 *   2. 按 parent_id 组装成若依 RouterVo 树（component/path/meta/children）
 *   3. 前端据此动态生成路由与侧边栏
 */
@Injectable()
export class MenuService {
  constructor(private readonly dataSource: DataSource) {}

  /** 入口：返回当前用户可访问的菜单树（数组 → 拦截器自动包 data） */
  async getRouters(userId: number) {
    const isAdmin = await this.isAdmin(userId);

    // 统一用原生 SQL 返回数据库列名（snake_case），保证 admin/普通用户字段一致
    let rows: any;
    if (isAdmin) {
      rows = await this.dataSource.query(
        `SELECT menu_id, parent_id, menu_name, path, component, menu_type,
                visible, icon, is_cache, order_num
           FROM sys_menu
          WHERE status = '0' AND menu_type IN ('M','C')
          ORDER BY parent_id, order_num`,
      );
    } else {
      rows = await this.dataSource.query(
        `SELECT DISTINCT m.menu_id, m.parent_id, m.menu_name, m.path, m.component,
                m.menu_type, m.visible, m.icon, m.is_cache, m.order_num
           FROM sys_menu m
           INNER JOIN sys_role_menu rm ON rm.menu_id = m.menu_id
           INNER JOIN sys_role r ON r.role_id = rm.role_id AND r.status = '0' AND r.del_flag = '0'
           INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
          WHERE ur.user_id = ? AND m.status = '0' AND m.menu_type IN ('M','C')
          ORDER BY m.parent_id, m.order_num`,
        [userId],
      );
    }

    const menus = Array.isArray(rows) ? rows : rows ? [rows] : [];
    return this.buildMenus(menus, 0);
  }

  /** 判断是否为 admin（拥有全部权限） */
  private async isAdmin(userId: number): Promise<boolean> {
    const rows: any = await this.dataSource.query(
      `SELECT r.role_key FROM sys_role r
         INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ?`,
      [userId],
    );
    const arr = Array.isArray(rows) ? rows : rows ? [rows] : [];
    return arr.some((r) => r.role_key === 'admin');
  }

  /** 递归组装菜单树（对齐若依 buildMenus） */
  private buildMenus(menus: any[], parentId: number): any[] {
    const routers: any[] = [];
    for (const menu of menus) {
      // MySQL bigint 返回字符串（如 '0'），必须转 number 才能正确比较父级
      if (Number(menu.parent_id) !== parentId) continue;
      const children = this.buildMenus(menus, Number(menu.menu_id));

      if (menu.menu_type === 'M') {
        // 目录：没有子菜单就不展示
        if (children.length === 0) continue;
        const isExternal = String(menu.path ?? '').includes('://');
        routers.push({
          name: this.getRouteName(menu.path),
          path: this.getPath(menu, parentId),
          hidden: menu.visible === '1',
          redirect: 'noRedirect',
          component: parentId === 0 ? (isExternal ? 'InnerLink' : 'Layout') : 'ParentView',
          alwaysShow: true,
          meta: { title: menu.menu_name, icon: menu.icon || '', noCache: menu.is_cache === 1 },
          children,
        });
      } else if (menu.menu_type === 'C') {
        // 菜单：component 用自己的组件路径
        const router: any = {
          name: this.getRouteName(menu.path),
          path: menu.path,
          hidden: menu.visible === '1',
          component: menu.component || 'ParentView',
          meta: { title: menu.menu_name, icon: menu.icon || '', noCache: menu.is_cache === 1 },
        };
        if (children.length) {
          router.children = children;
          router.redirect = 'noRedirect';
        }
        routers.push(router);
      }
    }
    return routers;
  }

  /** 路由 path：顶层目录加 "/"，子级保持，外链原样 */
  private getPath(menu: any, parentId: number): string {
    const p = menu.path ?? '';
    if (p.includes('://')) return p;
    if (parentId === 0) return '/' + p;
    return p;
  }

  /** 路由 name：去掉非字母数字、首字母大写（对齐若依 getRouteName） */
  private getRouteName(path: string): string {
    if (!path) return '';
    const cleaned = String(path).replace(/[^a-zA-Z0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
}
