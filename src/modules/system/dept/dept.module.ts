import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { SysDept } from './entities/sys-dept.entity.js';
import { DeptController } from './dept.controller.js';
import { DeptService } from './dept.service.js';

/**
 * DeptModule：部门模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysDept]), AuthModule],
  controllers: [DeptController],
  providers: [DeptService],
  // 导出 DeptService：别的模块（如用户模块）要用部门树
  exports: [DeptService],
})
export class DeptModule {}
