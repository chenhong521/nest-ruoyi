import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

/** 新增/修改用户 DTO（对齐若依 SysUser 表单字段） */
export class CreateUserDto {
  /** 部门ID */
  @IsOptional() @IsNumber() deptId?: number;

  /** 登录账号（必填） */
  @IsString() userName: string;

  /** 用户昵称 */
  @IsString() nickName: string;

  @IsOptional() @IsString() email?: string;

  @IsOptional() @IsString() phonenumber?: string;

  /** 性别（0男 1女 2未知） */
  @IsOptional() @IsString() sex?: string;

  /** 状态（0正常 1停用） */
  @IsOptional() @IsString() status?: string;

  /** 密码（不传则用 sys.user.initPassword 初始密码） */
  @IsOptional() @IsString() password?: string;

  /** 角色ID数组 */
  @IsOptional() @IsArray() roleIds?: number[];

  /** 岗位ID数组 */
  @IsOptional() @IsArray() postIds?: number[];

  @IsOptional() @IsString() remark?: string;
}

/** 修改用户 DTO：独立定义，userName 不可改（若依更新不允许改登录账号），故不要求必填 */
export class UpdateUserDto {
  /** 用户ID（必填） */
  @IsNumber() userId: number;

  @IsOptional() @IsNumber() deptId?: number;

  @IsOptional() @IsString() nickName?: string;

  @IsOptional() @IsString() email?: string;

  @IsOptional() @IsString() phonenumber?: string;

  /** 性别（0男 1女 2未知） */
  @IsOptional() @IsString() sex?: string;

  /** 状态（0正常 1停用） */
  @IsOptional() @IsString() status?: string;

  /** 角色ID数组 */
  @IsOptional() @IsArray() roleIds?: number[];

  /** 岗位ID数组 */
  @IsOptional() @IsArray() postIds?: number[];

  @IsOptional() @IsString() remark?: string;
}
