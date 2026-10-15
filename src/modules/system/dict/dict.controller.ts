import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DictService } from './dict.service.js';

/**
 * DictController：字典接口
 * GET /system/dict/type/list            字典类型列表
 * GET /system/dict/data/list            字典数据列表
 * GET /system/dict/data/type/{type}     按类型查数据（前端下拉框核心）
 */
@Controller('system/dict')
@ApiTags('字典管理')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Get('type/list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '字典类型列表' })
  typeList() {
    return this.dictService.findAllTypes();
  }

  @Get('data/list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '字典数据列表' })
  dataList() {
    return this.dictService.findAllData();
  }

  /** 前端 getDicts(dictType) 用它，返回该类型所有启用的数据 */
  @Get('data/type/:dictType')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '按类型查字典数据' })
  dataByType(@Param('dictType') dictType: string) {
    return this.dictService.findDataByType(dictType);
  }
}
