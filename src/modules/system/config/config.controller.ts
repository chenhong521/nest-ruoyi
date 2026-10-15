import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { success } from '../../../common/utils/api-response.js';
import { ConfigService } from './config.service.js';

/**
 * ConfigController：参数配置接口
 * GET /system/config/configKey/{key}   按配置键查值（前端首页等用）
 */
@Controller('system/config')
@ApiTags('参数配置')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('configKey/:configKey')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '按配置键查参数值' })
  async configKey(@Param('configKey') configKey: string) {
    // 对齐若依：success(配置值) → {code,msg,data:'123456'}，前端读 res.data
    return success({ data: await this.configService.findValueByKey(configKey) });
  }
}
