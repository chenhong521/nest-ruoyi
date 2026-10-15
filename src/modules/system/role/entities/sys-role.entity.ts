import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysRole：映射 sys_role 角色表
 * roleKey 是角色标识（如 admin / common），权限判断时用它归类
 */
@Entity('sys_role')
export class SysRole {
  /** 角色ID */
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  /** 角色名称 */
  @Column({ name: 'role_name' })
  roleName: string;

  /** 角色权限字符串（如 admin） */
  @Column({ name: 'role_key' })
  roleKey: string;

  /** 显示顺序 */
  @Column({ name: 'role_sort', type: 'int' })
  roleSort: number;

  /** 数据范围（1全部 2自定义 3本部门...） */
  @Column({ name: 'data_scope', default: '1', nullable: true })
  dataScope: string;

  /** 菜单树选择项是否关联显示 */
  @Column({ name: 'menu_check_strictly', type: 'tinyint', default: 1, nullable: true })
  menuCheckStrictly: number;

  /** 部门树选择项是否关联显示 */
  @Column({ name: 'dept_check_strictly', type: 'tinyint', default: 1, nullable: true })
  deptCheckStrictly: number;

  /** 角色状态（0正常 1停用） */
  @Column({ name: 'status' })
  status: string;

  /** 删除标志（0存在 2删除） */
  @Column({ name: 'del_flag', default: '0', nullable: true })
  delFlag: string;

  @Column({ name: 'create_by', nullable: true })
  createBy: string;

  @Column({ name: 'create_time', type: 'datetime', nullable: true })
  createTime: Date;

  @Column({ name: 'update_by', nullable: true })
  updateBy: string;

  @Column({ name: 'update_time', type: 'datetime', nullable: true })
  updateTime: Date;

  /** 备注 */
  @Column({ name: 'remark', nullable: true })
  remark: string;
}
