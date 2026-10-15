import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysNotice } from './entities/sys-notice.entity.js';

/**
 * NoticeService：公告业务
 */
@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(SysNotice)
    private readonly noticeRepo: Repository<SysNotice>,
  ) {}

  /** 首页公告栏：取启用的最新前 N 条（默认5）。只返回轻量字段，不含大字段内容 */
  async listTop(limit = 5) {
    const rows = await this.noticeRepo.find({
      where: { status: '0' },
      order: { createTime: 'DESC' },
      take: limit,
    });
    return rows.map((n) => ({
      noticeId: n.noticeId,
      noticeTitle: n.noticeTitle,
      noticeType: n.noticeType,
      createTime: n.createTime,
      createBy: n.createBy,
    }));
  }
}
