import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service.js';

/**
 * CaptchaController：验证码接口
 * 对应若依 CaptchaController 的 GET /captchaImage
 * 返回：{ captchaEnabled, uuid, img(base64) }
 * 前端拿到后用 "data:image/svg+xml;base64," + img 显示，登录时带 code + uuid
 */
@Controller()
@ApiTags('验证码')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('captchaImage')
  @ApiOperation({ summary: '获取验证码（返回 uuid + base64 图片）' })
  captchaImage() {
    return this.captchaService.getCaptchaImage();
  }
}
