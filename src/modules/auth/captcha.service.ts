import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'node:crypto';
import svgCaptcha from 'svg-captcha';
import { RedisService } from './redis.service.js';
import { success } from '../../common/utils/api-response.js';

/** 验证码 Redis key 前缀（与若依 CacheConstants.CAPTCHA_CODE_KEY 一致） */
const CAPTCHA_CODE_KEY = 'captcha_codes:';
/** 验证码过期时间（分钟，与若依 Constants.CAPTCHA_EXPIRATION 一致） */
const CAPTCHA_EXPIRATION = 2;

/**
 * CaptchaService：验证码生成与校验
 * 对应若依 CaptchaController + CaptchaConfig
 * - 生成：svg-captcha 生成字符验证码 → 存 Redis（key: captcha_codes:{uuid}，TTL 2分钟）
 * - 开关：读 sys_config 的 sys.account.captchaEnabled
 * - 校验：登录时比对 Redis 里的答案（一次性，校验后删除）
 */
@Injectable()
export class CaptchaService {
  constructor(
    private readonly redis: RedisService,
    private readonly dataSource: DataSource,
  ) {}

  /** 生成验证码，返回顶层结构（对齐若依 AjaxResult，前端直接读顶层字段） */
  async getCaptchaImage() {
    const enabled = await this.captchaEnabled();
    if (!enabled) {
      return success({ captchaEnabled: false, uuid: '', img: '' });
    }

    // 生成字符验证码（4位，排除易混淆字符 0o1lI）
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      ignoreChars: '0o1iIl',
      color: true,
      background: '#f0f0f0',
    });

    const uuid = randomUUID().replace(/-/g, ''); // 32位无横线，贴近若依 simpleUUID
    // 存答案到 Redis，TTL 2分钟
    await this.redis.set(
      `${CAPTCHA_CODE_KEY}${uuid}`,
      captcha.text.toLowerCase(),
      CAPTCHA_EXPIRATION * 60,
    );

    // 返回顶层完整响应：透传机制会让拦截器原样放行（不包 data）
    return success({
      captchaEnabled: true,
      uuid,
      img: Buffer.from(captcha.data).toString('base64'), // 前端拼 data:image/svg+xml;base64,
    });
  }

  /** 校验验证码（登录时调用），不对则抛 401 */
  async verifyCaptcha(uuid: string | undefined, code: string | undefined) {
    // 未启用验证码 → 直接放行
    if (!(await this.captchaEnabled())) {
      return;
    }
    if (!uuid || !code) {
      throw new HttpException('验证码不能为空', HttpStatus.BAD_REQUEST);
    }
    const saved = await this.redis.get(`${CAPTCHA_CODE_KEY}${uuid}`);
    if (!saved) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    // 一次性：校验完删除
    await this.redis.del(`${CAPTCHA_CODE_KEY}${uuid}`);
    if (saved !== code.toLowerCase()) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
  }

  /** 读 sys_config 判断验证码是否启用 */
  private async captchaEnabled(): Promise<boolean> {
    const result: any = await this.dataSource.query(
      `SELECT config_value FROM sys_config WHERE config_key = 'sys.account.captchaEnabled'`,
    );
    // 兼容返回对象或数组两种格式
    const first = Array.isArray(result) ? result[0] : result;
    return first?.config_value === 'true';
  }
}
