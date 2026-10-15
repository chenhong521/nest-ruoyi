import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysDictData：映射 sys_dict_data 字典数据表
 * dictLabel 标签、dictValue 值、dictType 所属类型、listClass 样式（primary/success等）
 */
@Entity('sys_dict_data')
export class SysDictData {
  /** 字典编码 */
  @PrimaryGeneratedColumn({ name: 'dict_code' })
  dictCode: number;

  /** 字典排序 */
  @Column({ name: 'dict_sort', type: 'int', default: 0, nullable: true })
  dictSort: number;

  /** 字典标签（显示用，如"男"） */
  @Column({ name: 'dict_label', nullable: true })
  dictLabel: string;

  /** 字典键值（值，如 0） */
  @Column({ name: 'dict_value', nullable: true })
  dictValue: string;

  /** 字典类型（关联 sys_dict_type.dict_type，如 sys_user_sex） */
  @Column({ name: 'dict_type', nullable: true })
  dictType: string;

  /** 样式属性（如 css 类） */
  @Column({ name: 'css_class', nullable: true })
  cssClass: string;

  /** 表格回显样式（primary/success/info/warning/danger） */
  @Column({ name: 'list_class', nullable: true })
  listClass: string;

  /** 是否默认（Y是 N否） */
  @Column({ name: 'is_default', default: 'N', nullable: true })
  isDefault: string;

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
