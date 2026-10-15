import { Entity, PrimaryColumn } from 'typeorm';

/**
 * SysUserRole：映射 sys_user_role 关联表（用户 ↔ 角色，多对多）
 * 复合主键：user_id + role_id
 * 这张表没有业务字段，只记录"哪个用户属于哪个角色"
 */
@Entity('sys_user_role')
export class SysUserRole {
  /** 用户ID（复合主键之一） */
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  /** 角色ID（复合主键之一） */
  @PrimaryColumn({ name: 'role_id' })
  roleId: number;
}
