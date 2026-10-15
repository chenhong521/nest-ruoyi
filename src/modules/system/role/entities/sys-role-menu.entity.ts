import { Entity, PrimaryColumn } from 'typeorm';

/**
 * SysRoleMenu：映射 sys_role_menu 关联表（角色 ↔ 菜单/权限，多对多）
 * 复合主键：role_id + menu_id
 * 记录"哪个角色拥有哪个菜单/权限"
 */
@Entity('sys_role_menu')
export class SysRoleMenu {
  /** 角色ID（复合主键之一） */
  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  /** 菜单ID（复合主键之一） */
  @PrimaryColumn({ name: 'menu_id' })
  menuId: number;
}
