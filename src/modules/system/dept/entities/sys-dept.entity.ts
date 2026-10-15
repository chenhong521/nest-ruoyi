import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysDept：映射 sys_dept 部门表
 * deptName 部门名称、parentId 父部门ID、ancestors 祖级列表（如 0,100）
 */
@Entity('sys_dept')
export class SysDept {
  /** 部门ID */
  @PrimaryGeneratedColumn({ name: 'dept_id' })
  deptId: number;

  /** 父部门ID（0 表示顶级） */
  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId: number;

  /** 祖级列表（如 0,100，用于快速查子孙） */
  @Column({ name: 'ancestors', nullable: true })
  ancestors: string;

  /** 部门名称 */
  @Column({ name: 'dept_name' })
  deptName: string;

  /** 显示顺序 */
  @Column({ name: 'order_num', type: 'int', nullable: true })
  orderNum: number;

  /** 负责人 */
  @Column({ name: 'leader', nullable: true })
  leader: string;

  /** 联系电话 */
  @Column({ name: 'phone', nullable: true })
  phone: string;

  /** 邮箱 */
  @Column({ name: 'email', nullable: true })
  email: string;

  /** 部门状态（0正常 1停用） */
  @Column({ name: 'status', default: '0', nullable: true })
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
}
