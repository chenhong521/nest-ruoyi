import { Entity, PrimaryColumn } from 'typeorm';

/**
 * SysUserPost：映射 sys_user_post 用户-岗位关联表（复合主键）
 * userId + postId 联合唯一，一个用户可多岗位
 */
@Entity('sys_user_post')
export class SysUserPost {
  /** 用户ID（复合主键） */
  @PrimaryColumn({ name: 'user_id', type: 'bigint' })
  userId: number;

  /** 岗位ID（复合主键） */
  @PrimaryColumn({ name: 'post_id', type: 'bigint' })
  postId: number;
}
