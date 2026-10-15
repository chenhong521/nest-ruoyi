import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SysUser } from '../system/user/entities/sys-user.entity.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { CaptchaController } from './captcha.controller.js';
import { CaptchaService } from './captcha.service.js';
import { RedisService } from './redis.service.js';

/**
 * AuthModule：认证模块
 * - TypeOrmModule.forFeature([SysUser])：在本模块开放 SysUser 的仓储注入
 * - JwtModule：配置 JWT 的 secret 和过期时间（读 .env）
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SysUser]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'ruoyi-nest-jwt-secret-key'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '30m') },
      }),
    }),
  ],
  controllers: [AuthController, CaptchaController],
  providers: [AuthService, RedisService, CaptchaService],
  // 导出 JwtModule + RedisService，让别的模块（User/Menu 等）也能注入 JwtService / RedisService
  exports: [JwtModule, RedisService],
})
export class AuthModule {}
