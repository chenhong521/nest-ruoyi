import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';

/**
 * HealthModule：健康检查模块
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
