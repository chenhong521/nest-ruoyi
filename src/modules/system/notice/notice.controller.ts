import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { NoticeService } from './notice.service.js';

/**
 * NoticeController：公告接口
 * GET /system/notice/listTop   首页公告栏（最新前5条）
 */
@Controller('system/notice')
@ApiTags('通知公告')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('listTop')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '首页公告栏' })
  listTop() {
    return this.noticeService.listTop();
  }
}
