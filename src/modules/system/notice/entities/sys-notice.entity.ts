import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysNotice：映射 sys_notice 通知公告表
 * noticeTitle 标题、noticeType 类型(1通知 2公告)、noticeContent 内容(blob)
 */
@Entity('sys_notice')
export class SysNotice {
  /** 公告ID */
  @PrimaryGeneratedColumn({ name: 'notice_id', type: 'int' })
  noticeId: number;

  /** 公告标题 */
  @Column({ name: 'notice_title' })
  noticeTitle: string;

  /** 公告类型（1通知 2公告） */
  @Column({ name: 'notice_type', type: 'char', length: 1, nullable: true })
  noticeType: string;

  /** 公告内容（longblob，驱动返回 Buffer，读时转字符串） */
  @Column({ name: 'notice_content', type: 'longblob', nullable: true })
  noticeContent: any;

  /** 公告状态（0正常 1关闭） */
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
