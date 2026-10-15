import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { pageResult, type PageQuery } from '../../../common/utils/page.js';
import { DictService } from './dict.service.js';

/**
 * DictController：字典接口
 * GET /system/dict/type/list            字典类型分页列表（rows/total）
 * GET /system/dict/data/list            字典数据分页列表（rows/total）
 * GET /system/dict/data/type/{type}     按类型查数据（非分页 data，前端下拉框核心）
 */
@Controller('system/dict')
@ApiTags('字典管理')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Get('type/list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '字典类型分页列表' })
  async typeList(@Query() query: PageQuery) {
    const { rows, total } = await this.dictService.findTypesPage(query);
    return pageResult(rows, total);
  }

  @Get('data/list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '字典数据分页列表' })
  async dataList(@Query() query: PageQuery) {
    const { rows, total } = await this.dictService.findDataPage(query);
    return pageResult(rows, total);
  }

  /** 前端 getDicts(dictType) 用它，返回该类型所有启用的数据（非分页） */
  @Get('data/type/:dictType')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '按类型查字典数据' })
  dataByType(@Param('dictType') dictType: string) {
    return this.dictService.findDataByType(dictType);
  }
}
