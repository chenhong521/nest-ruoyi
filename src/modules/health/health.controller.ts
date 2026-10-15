import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { success } from '../../common/utils/api-response.js';

/**
 * HealthController：健康检查
 * GET / —— 运维探活用，返回服务在线状态
 */
@Controller()
@ApiTags('健康检查')
export class HealthController {
  @Get()
  @ApiOperation({ summary: '健康检查，返回服务状态' })
  health() {
    // success() 带 code+msg → 拦截器透传，返回 { code, msg, status:'up', time }
    return success({ status: 'up', time: Date.now() });
  }
}
