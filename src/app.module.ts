import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUser } from './modules/system/user/entities/sys-user.entity.js';
import { SysRole } from './modules/system/role/entities/sys-role.entity.js';
import { SysMenu } from './modules/system/menu/entities/sys-menu.entity.js';
import { SysUserRole } from './modules/system/role/entities/sys-user-role.entity.js';
import { SysRoleMenu } from './modules/system/role/entities/sys-role-menu.entity.js';
import { SysDept } from './modules/system/dept/entities/sys-dept.entity.js';
import { SysPost } from './modules/system/post/entities/sys-post.entity.js';
import { SysDictType } from './modules/system/dict/entities/sys-dict-type.entity.js';
import { SysDictData } from './modules/system/dict/entities/sys-dict-data.entity.js';
import { SysNotice } from './modules/system/notice/entities/sys-notice.entity.js';
import { SysConfig } from './modules/system/config/entities/sys-config.entity.js';
import { SysUserPost } from './modules/system/user/entities/sys-user-post.entity.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/system/user/user.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { MenuModule } from './modules/system/menu/menu.module.js';
import { DeptModule } from './modules/system/dept/dept.module.js';
import { PostModule } from './modules/system/post/post.module.js';
import { DictModule } from './modules/system/dict/dict.module.js';
import { NoticeModule } from './modules/system/notice/notice.module.js';
import { SysConfigModule } from './modules/system/config/config.module.js';

@Module({
  imports: [
    // 全局环境变量（读取 .env）
    ConfigModule.forRoot({ isGlobal: true }),
    // 连接若依主库 ry-vue
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: +config.get('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', '123456'),
        database: config.get('DB_DATABASE', 'ry-vue'),
        entities: [
          SysUser,
          SysRole,
          SysMenu,
          SysUserRole,
          SysRoleMenu,
          SysDept,
          SysPost,
          SysDictType,
          SysDictData,
          SysNotice,
          SysConfig,
          SysUserPost,
        ],
        // 若依表结构已定，绝不能自动改表
        synchronize: false,
      }),
    }),
    // 认证模块（登录/JWT/Redis 会话）
    AuthModule,
    // 系统用户模块（演示 RBAC 权限）
    UserModule,
    // 健康检查（GET /）
    HealthModule,
    // 动态路由（GET /getRouters）
    MenuModule,
    // 部门模块（GET /system/dept/list、treeselect）
    DeptModule,
    // 岗位模块（GET /system/post/list）
    PostModule,
    // 字典模块（GET /system/dict/type/list、data/type/{type}）
    DictModule,
    // 公告模块（GET /system/notice/listTop）
    NoticeModule,
    // 参数配置模块（GET /system/config/configKey/{key}）
    SysConfigModule,
  ],
})
export class AppModule {}
