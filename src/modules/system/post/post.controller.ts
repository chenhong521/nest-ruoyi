import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { PostService } from './post.service.js';

/**
 * PostController：岗位接口
 * GET /system/post/list         岗位列表
 * GET /system/post/export
 * 需登录
 */
@Controller('system/post')
@ApiTags('岗位管理')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '岗位列表' })
  list(@Query('all') all?: string) {
    // ?all=1 返回全部（含停用），默认只返启用（下拉用）
    return all === '1' ? this.postService.findAll() : this.postService.findEnabled();
  }
}
