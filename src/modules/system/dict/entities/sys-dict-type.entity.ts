import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysDictType：映射 sys_dict_type 字典类型表
 * dictName 字典名称、dictType 字典类型编码（如 sys_user_sex）
 */
@Entity('sys_dict_type')
export class SysDictType {
  /** 字典主键 */
  @PrimaryGeneratedColumn({ name: 'dict_id' })
  dictId: number;

  /** 字典名称 */
  @Column({ name: 'dict_name', nullable: true })
  dictName: string;

  /** 字典类型（前端用它查该类型下的数据） */
  @Column({ name: 'dict_type', nullable: true })
  dictType: string;

  /** 状态（0正常 1停用） */
  @Column({ name: 'status', default: '0', nullable: true })
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
