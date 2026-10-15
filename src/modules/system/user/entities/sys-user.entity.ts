import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysUser：映射若依主库 ry-vue 的 sys_user 表
 * 每个属性对应一列（用 name 指定列名，TS 属性用驼峰）
 */
@Entity('sys_user')
export class SysUser {
  /** 用户ID（主键，自增） */
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  /** 部门ID */
  @Column({ name: 'dept_id', nullable: true })
  deptId: number;

  /** 登录账号 */
  @Column({ name: 'user_name' })
  userName: string;

  /** 用户昵称 */
  @Column({ name: 'nick_name' })
  nickName: string;

  /** 用户类型（00=系统用户） */
  @Column({ name: 'user_type', default: '00' })
  userType: string;

  /** 邮箱 */
  @Column({ name: 'email', nullable: true })
  email: string;

  /** 手机号 */
  @Column({ name: 'phonenumber', nullable: true })
  phonenumber: string;

  /** 性别（0男 1女 2未知） */
  @Column({ name: 'sex', default: '0' })
  sex: string;

  /** 头像地址 */
  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  /** 密码（BCrypt 加密） */
  @Column({ name: 'password', nullable: true })
  password: string;

  /** 帐号状态（0正常 1停用） */
  @Column({ name: 'status', default: '0' })
  status: string;

  /** 删除标志（0存在 2删除） */
  @Column({ name: 'del_flag', default: '0' })
  delFlag: string;

  /** 最后登录IP */
  @Column({ name: 'login_ip', nullable: true })
  loginIp: string;

  /** 最后登录时间 */
  @Column({ name: 'login_date', type: 'datetime', nullable: true })
  loginDate: Date;

  /** 密码最后更新时间 */
  @Column({ name: 'pwd_update_date', type: 'datetime', nullable: true })
  pwdUpdateDate: Date;

  /** 创建者 */
  @Column({ name: 'create_by', nullable: true })
  createBy: string;

  /** 创建时间 */
  @Column({ name: 'create_time', type: 'datetime', nullable: true })
  createTime: Date;

  /** 更新者 */
  @Column({ name: 'update_by', nullable: true })
  updateBy: string;

  /** 更新时间 */
  @Column({ name: 'update_time', type: 'datetime', nullable: true })
  updateTime: Date;

  /** 备注 */
  @Column({ name: 'remark', nullable: true })
  remark: string;
}
