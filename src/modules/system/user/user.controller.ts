import {
  Controller, Get, Post, Put, Delete, Query, Param, Body,
  ParseIntPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/permissions.guard.js';
import { RequiresPermissions } from '../../auth/permissions.decorator.js';
import { DeptService } from '../dept/dept.service.js';
import { pageResult, type PageQuery } from '../../../common/utils/page.js';
import { success } from '../../../common/utils/api-response.js';
import { UserService } from './user.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';

/**
 * UserController：系统用户接口（对齐若依 SysUserController）
 *  GET    /system/user/list       分页列表（需 system:user:list）
 *  GET    /system/user/deptTree   部门树
 *  GET    /system/user/{userId}   用户详情（含角色/岗位回显）
 *  POST   /system/user            新增用户
 *  PUT    /system/user            修改用户
 *  DELETE /system/user/{userIds}  删除用户（可批量）
 *  PUT    /system/user/resetPwd   重置密码
 *  PUT    /system/user/changeStatus  修改状态
 */
@Controller('system/user')
@ApiTags('系统用户')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly deptService: DeptService,
  ) {}

  @Get('list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:list')
  @ApiOperation({ summary: '用户分页列表' })
  async list(@Query() query: PageQuery) {
    const { rows, total } = await this.userService.findPage(query);
    return pageResult(rows, total);
  }

  @Get('deptTree')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '用户管理-部门树' })
  deptTree() {
    return this.deptService.treeselect();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:query')
  @ApiOperation({ summary: '用户详情（含角色/岗位）' })
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    // 包 data：{ code,msg, data:{ user, roles, posts } }，前端读 res.data.user / res.data.roles
    return success({ data: await this.userService.findOne(userId) });
  }

  // 路径数组 ['', '/']：同时兼容 /system/user 与 /system/user/（前端个别调用带尾斜杠）
  @Post(['', '/'])
  @HttpCode(HttpStatus.OK) // 对齐若依：创建也返回 HTTP 200（默认 201）
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:add')
  @ApiOperation({ summary: '新增用户' })
  async create(@Body() dto: CreateUserDto) {
    return success(await this.userService.create(dto));
  }

  @Put(['', '/'])
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '修改用户' })
  async update(@Body() dto: UpdateUserDto) {
    await this.userService.update(dto);
    return success(); // { code:200, msg:'操作成功' }
  }

  @Delete(':userIds')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:remove')
  @ApiOperation({ summary: '删除用户（可批量）' })
  async remove(@Param('userIds') userIds: string) {
    // userIds 逗号分隔 → 数字数组
    const ids = userIds.split(',').map((s) => Number(s.trim()));
    await this.userService.remove(ids);
    return success();
  }

  @Put('resetPwd')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:resetPwd')
  @ApiOperation({ summary: '重置密码' })
  async resetPwd(@Body() body: { userId: number; password: string }) {
    await this.userService.resetPwd(Number(body.userId), body.password);
    return success();
  }

  @Put('changeStatus')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequiresPermissions('system:user:edit')
  @ApiOperation({ summary: '修改用户状态' })
  async changeStatus(@Body() body: { userId: number; status: string }) {
    await this.userService.changeStatus(Number(body.userId), body.status);
    return success();
  }
}
