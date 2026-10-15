import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { SysUser } from './entities/sys-user.entity.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

/**
 * UserModule：系统用户模块
 * 导入 AuthModule：因为 UserController 用了 JwtAuthGuard，它需要 JwtService
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysUser]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
