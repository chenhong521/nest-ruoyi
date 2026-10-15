import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysPost：映射 sys_post 岗位表
 * postCode 岗位编码、postName 岗位名称、postSort 排序
 */
@Entity('sys_post')
export class SysPost {
  /** 岗位ID */
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  /** 岗位编码（如 ceo、se） */
  @Column({ name: 'post_code' })
  postCode: string;

  /** 岗位名称 */
  @Column({ name: 'post_name' })
  postName: string;

  /** 显示顺序 */
  @Column({ name: 'post_sort', type: 'int' })
  postSort: number;

  /** 状态（0正常 1停用） */
  @Column({ name: 'status', type: 'char', length: 1 })
  status: string;

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
