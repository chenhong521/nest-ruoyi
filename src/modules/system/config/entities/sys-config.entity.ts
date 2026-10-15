import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysConfig：映射 sys_config 参数配置表
 * configKey 参数键、configValue 参数值（如 sys.user.initPassword=123456）
 */
@Entity('sys_config')
export class SysConfig {
  /** 参数主键 */
  @PrimaryGeneratedColumn({ name: 'config_id' })
  configId: number;

  /** 参数名称 */
  @Column({ name: 'config_name' })
  configName: string;

  /** 参数键名 */
  @Column({ name: 'config_key' })
  configKey: string;

  /** 参数键值 */
  @Column({ name: 'config_value' })
  configValue: string;

  /** 系统内置（Y是 N否） */
  @Column({ name: 'config_type', type: 'char', length: 1, nullable: true })
  configType: string;

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
