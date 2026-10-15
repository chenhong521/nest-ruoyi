import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisService } from './redis.service.js';

/**
 * JwtAuthGuard：JWT 鉴权守卫
 * 1. 校验请求头 Authorization: Bearer <token>（JWT 签名）
 * 2. 校验 Redis 会话仍存在（login_token:{userId}）
 *    —— logout 删除会话后，旧 token 立即失效（真正的"退出闭环"）
 * 通过则把解析出的用户信息挂到 req.user，供 Controller 使用
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: any }>();
    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('未登录');
    }

    const token = auth.slice(7); // 去掉 "Bearer "
    try {
      const payload = await this.jwtService.verifyAsync(token);
      // 校验会话仍在：logout 删除 login_token:{userId} 后，旧 token 再访问就 401
      const session = await this.redis.get(`login_token:${payload.userId}`);
      if (!session) {
        throw new UnauthorizedException('登录已过期，请重新登录');
      }
      req.user = payload; // { userId, username, ... }
      return true;
    } catch {
      throw new UnauthorizedException('登录已过期或无效');
    }
  }
}
