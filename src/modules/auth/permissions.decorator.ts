import { SetMetadata } from '@nestjs/common';

/** 存权限标识的 metadata key */
export const REQUIRES_PERMISSIONS_KEY = 'requiresPermissions';

/**
 * @RequiresPermissions('system:user:list')
 * 声明访问该接口需要哪些权限。
 * 用法：把这个装饰器挂在 Controller 的方法上，
 * 配合 PermissionsGuard 在请求进来时检查当前用户是否拥有这些权限。
 */
export const RequiresPermissions = (...permissions: string[]) =>
  SetMetadata(REQUIRES_PERMISSIONS_KEY, permissions);
