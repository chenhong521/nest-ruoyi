import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module.js';
import { MenuController } from './menu.controller.js';
import { MenuService } from './menu.service.js';

/**
 * MenuModule：动态路由模块
 * imports AuthModule —— 复用 JwtAuthGuard（认证）
 */
@Module({
  imports: [AuthModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
