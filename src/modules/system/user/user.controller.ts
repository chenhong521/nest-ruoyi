import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { PermissionsGuard } from '../../auth/permissions.guard.js';
import { RequiresPermissions } from '../../auth/permissions.decorator.js';
import { UserService } from './user.service.js';

/**
 * UserController：系统用户接口
 * 演示 RBAC 权限控制：
 *   GET /system/user/list —— 需要登录 + 需要权限 system:user:list
 * 对应若依的 @PreAuthorize("@ss.hasPermi('system:user:list')")
 */
@Controller('system/user')
@ApiTags('系统用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  // 认证：没有 token 直接 401
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // 授权：声明本接口需要的权限
  @RequiresPermissions('system:user:list')
  @ApiOperation({ summary: '查询用户列表（需权限 system:user:list）' })
  list() {
    return this.userService.findAll();
  }
}
