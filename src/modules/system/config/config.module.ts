import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { SysConfig } from './entities/sys-config.entity.js';
import { ConfigController } from './config.controller.js';
import { ConfigService } from './config.service.js';

/**
 * SysConfigModule：参数配置模块
 * 类名加 Sys 前缀：避免和 @nestjs/config 的 ConfigModule 重名
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysConfig]), AuthModule],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class SysConfigModule {}
