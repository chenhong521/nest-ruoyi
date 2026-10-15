import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { SysNotice } from './entities/sys-notice.entity.js';
import { NoticeController } from './notice.controller.js';
import { NoticeService } from './notice.service.js';

/**
 * NoticeModule：公告模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysNotice]), AuthModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
