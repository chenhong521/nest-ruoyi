import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { pageResult, type PageQuery } from '../../../common/utils/page.js';
import { PostService } from './post.service.js';

/**
 * PostController：岗位接口
 * GET /system/post/list   岗位分页列表（rows/total）
 * 需登录
 */
@Controller('system/post')
@ApiTags('岗位管理')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '岗位分页列表' })
  async list(@Query() query: PageQuery) {
    // 对齐若依 getDataTable：返回 {code,msg,rows,total}
    const { rows, total } = await this.postService.findPage(query);
    return pageResult(rows, total);
  }
}
