import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** 登录入参 DTO（配合全局 ValidationPipe 校验） */
export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码', example: 'admin123' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiPropertyOptional({ description: '验证码', example: 'a1b2' })
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: '验证码标识 uuid', example: 'xxxx' })
  @IsOptional()
  uuid?: string;
}
