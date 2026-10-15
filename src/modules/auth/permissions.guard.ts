import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { REQUIRES_PERMISSIONS_KEY } from './permissions.decorator.js';

/**
 * PermissionsGuard：权限守卫（对应若依 @PreAuthorize）
 * 流程：
 *   1. 读接口方法上的 @RequiresPermissions 元数据
 *   2. 没声明 → 直接放行（公开接口）
 *   3. 声明了 → 从 req.user.userId 出发，查该用户拥有的角色和权限
 *   4. admin 角色 → 全放行（若依约定）
 *   5. 否则比对接口要求的权限是否在用户权限集里 → 没有则 403
 *
 * 注意：需配合 JwtAuthGuard 先使用（先认证出 userId，再谈权限）
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 读接口要求哪些权限
    const required: string[] =
      Reflect.getMetadata(
        REQUIRES_PERMISSIONS_KEY,
        context.getHandler(),
      ) ?? [];
    if (required.length === 0) {
      return true; // 没声明权限要求 → 放行
    }

    // 2. 拿当前用户（由 JwtAuthGuard 注入 req.user）
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const userId = req.user?.userId;
    if (!userId) {
      throw new ForbiddenException('没有访问权限');
    }

    // 3. 查该用户的所有角色（判断是否 admin 超管）
    const roles: any[] = await this.dataSource.query(
      `SELECT r.role_key FROM sys_role r
         INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ? AND r.status = '0' AND r.del_flag = '0'`,
      [userId],
    );
    if (roles.some((r) => r.role_key === 'admin')) {
      return true; // admin 角色拥有全部权限
    }

    // 4. 查该用户拥有的全部权限标识（menu.perms 去重）
    const permsRows: any[] = await this.dataSource.query(
      `SELECT DISTINCT m.perms FROM sys_menu m
         INNER JOIN sys_role_menu rm ON rm.menu_id = m.menu_id
         INNER JOIN sys_role r ON r.role_id = rm.role_id AND r.status = '0' AND r.del_flag = '0'
         INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ? AND m.perms IS NOT NULL AND m.perms != ''`,
      [userId],
    );
    const userPerms = permsRows.map((r) => r.perms);

    // 5. 接口要求的权限是否命中
    const hasPermission = required.some((p) => userPerms.includes(p));
    if (!hasPermission) {
      throw new ForbiddenException('没有该操作权限');
    }
    return true;
  }
}
