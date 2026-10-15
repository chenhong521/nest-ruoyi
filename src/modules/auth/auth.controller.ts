import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { LoginDto } from './dto/login.dto.js';

/**
 * AuthController：认证接口
 * 路径与若依后端保持一致，前端可直接对接：
 *   POST /login     登录，返回 token
 *   GET  /getInfo   获取当前登录用户信息（需带 token）
 */
@Controller()
@ApiTags('认证')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /login 登录 */
  @Post('login')
  @HttpCode(HttpStatus.OK) // 若依前端期望 HTTP 200
  @ApiOperation({ summary: '登录，返回 token' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** GET /getInfo 获取用户信息（带 token 访问） */
  @Get('getInfo')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前登录用户信息' })
  getInfo(@Req() req: Request & { user?: any }) {
    return this.authService.getUserInfo(req.user.userId);
  }

  /**
   * POST /logout 退出登录
   * 注意：不挂 JwtAuthGuard！即使 token 已过期，logout 也必须能成功（否则前端卡死无法登出）
   * 解析方式见 authService.logout（decode 不校验过期）
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '退出登录，会话失效' })
  logout(@Req() req: Request) {
    return this.authService.logout(req.headers.authorization);
  }
}
