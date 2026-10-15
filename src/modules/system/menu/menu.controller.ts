import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { MenuService } from './menu.service.js';

/**
 * MenuController：动态路由接口
 * GET /getRouters —— 需登录，返回当前用户的菜单树（前端生成动态路由）
 * 对应若依 SysLoginController.getRouters
 */
@Controller()
@ApiTags('菜单路由')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('getRouters')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前用户动态路由（需登录）' })
  getRouters(@Req() req: Request & { user?: any }) {
    // 返回菜单树数组 → 拦截器自动包 data → 前端读 res.data
    return this.menuService.getRouters(req.user.userId);
  }
}
