import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * SysMenu：映射 sys_menu 菜单/权限表
 * perms 是最关键字段——权限标识（如 system:user:list），RBAC 靠它判断能否访问
 * menuType：M=目录，C=菜单，F=按钮权限点
 */
@Entity('sys_menu')
export class SysMenu {
  /** 菜单ID */
  @PrimaryGeneratedColumn({ name: 'menu_id' })
  menuId: number;

  /** 菜单名称 */
  @Column({ name: 'menu_name' })
  menuName: string;

  /** 父菜单ID */
  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId: number;

  /** 显示顺序 */
  @Column({ name: 'order_num', type: 'int', nullable: true })
  orderNum: number;

  /** 路由地址 */
  @Column({ name: 'path', nullable: true })
  path: string;

  /** 组件路径 */
  @Column({ name: 'component', nullable: true })
  component: string;

  /** 路由参数 */
  @Column({ name: 'query', nullable: true })
  query: string;

  /** 路由名称 */
  @Column({ name: 'route_name', nullable: true })
  routeName: string;

  /** 是否为外链（0是 1否） */
  @Column({ name: 'is_frame', type: 'int', default: 1, nullable: true })
  isFrame: number;

  /** 是否缓存（0缓存 1不缓存） */
  @Column({ name: 'is_cache', type: 'int', default: 0, nullable: true })
  isCache: number;

  /** 菜单类型（M目录 C菜单 F按钮） */
  @Column({ name: 'menu_type', default: '', nullable: true })
  menuType: string;

  /** 菜单状态（0显示 1隐藏） */
  @Column({ name: 'visible', default: '0', nullable: true })
  visible: string;

  /** 菜单状态（0正常 1停用） */
  @Column({ name: 'status', default: '0', nullable: true })
  status: string;

  /** 权限标识（★核心：如 system:user:list） */
  @Column({ name: 'perms', nullable: true })
  perms: string;

  /** 菜单图标 */
  @Column({ name: 'icon', nullable: true })
  icon: string;

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
