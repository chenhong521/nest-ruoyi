import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { DeptModule } from '../dept/dept.module.js';
import { SysUser } from './entities/sys-user.entity.js';
import { SysUserPost } from './entities/sys-user-post.entity.js';
import { SysUserRole } from '../role/entities/sys-user-role.entity.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

/**
 * UserModule：系统用户模块
 * 导入 AuthModule：JwtAuthGuard 需要 JwtService
 * 导入 DeptModule：deptTree 要用部门树
 * forFeature 注册 SysUserPost + SysUserRole：维护用户-岗位/角色关联
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SysUser, SysUserPost, SysUserRole]),
    AuthModule,
    DeptModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
