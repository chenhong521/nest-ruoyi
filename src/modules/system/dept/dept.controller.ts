import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DeptService } from './dept.service.js';

/**
 * DeptController：部门接口
 * GET /system/dept/list       部门列表（平铺）
 * GET /system/dept/treeselect 部门树（下拉/父级选择）
 * 需登录；权限控制按需加 @RequiresPermissions
 */
@Controller('system/dept')
@ApiTags('部门管理')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '部门列表' })
  list() {
    return this.deptService.findAll();
  }

  @Get('treeselect')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '部门树（下拉选择）' })
  treeselect() {
    return this.deptService.treeselect();
  }
}
