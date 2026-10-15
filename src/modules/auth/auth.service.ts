import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SysUser } from '../system/user/entities/sys-user.entity.js';
import { RedisService } from './redis.service.js';
import { CaptchaService } from './captcha.service.js';
import { LoginDto } from './dto/login.dto.js';
import { success } from '../../common/utils/api-response.js';

/**
 * AuthService：登录认证业务逻辑
 * 流程：校验验证码 → 查用户 → 校验 BCrypt 密码 → 签发 JWT → 会话存 Redis
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SysUser)
    private readonly userRepo: Repository<SysUser>,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly captchaService: CaptchaService,
    private readonly dataSource: DataSource,
  ) {}

  /** 登录：返回 { token, user } */
  async login(dto: LoginDto) {
    const { username, password } = dto;

    // 0. 校验验证码（captchaEnabled=false 时自动跳过）
    await this.captchaService.verifyCaptcha(dto.uuid, dto.code);

    // 1. 按用户名查用户
    const user = await this.userRepo.findOne({
      where: { userName: username },
    });
    // 登录失败统一返回 400（业务/请求失败），不用 401——
    // 401 会触发前端"强制登出"，但登录失败用户还没登录，不该登出
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.status !== '0') {
      throw new HttpException('账号已停用', HttpStatus.BAD_REQUEST);
    }

    // 2. 校验密码（sys_user.password 是 BCrypt 加密的，用 bcrypt.compare）
    const ok = await bcrypt.compare(password, user.password ?? '');
    if (!ok) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    // 3. 签发 JWT（payload 带 userId + username）
    const token = await this.jwtService.signAsync({
      userId: user.userId,
      username: user.userName,
    });

    // 4. 会话存 Redis（key: login_token:userId，TTL 30 分钟 = 1800 秒）
    await this.redis.set(
      `login_token:${user.userId}`,
      JSON.stringify({
        userId: user.userId,
        username: user.userName,
        nickName: user.nickName,
      }),
      1800,
    );

    // 返回顶层完整响应（success() 带 code+msg，拦截器透传不包 data）
    // 对齐若依 AjaxResult.success().put("token", token)：前端直接读 res.token
    return success({ token });
  }

  /**
   * 根据 userId 取当前登录用户信息（/getInfo 用）
   * 返回顶层结构（对齐若依 AjaxResult，透传机制原样放行）：
   *   user: 用户信息
   *   roles: 角色标识数组（如 ['admin']）
   *   permissions: 权限标识数组（admin 返回 ['*:*:*'] 全权限）
   */
  async getUserInfo(userId: number) {
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 查用户角色（sys_user_role → sys_role）
    const rolesResult: any = await this.dataSource.query(
      `SELECT r.role_key FROM sys_role r
         INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ? AND r.status = '0' AND r.del_flag = '0'`,
      [userId],
    );
    const roleRows = Array.isArray(rolesResult) ? rolesResult : rolesResult ? [rolesResult] : [];
    const roleKeys = roleRows.map((r) => r.role_key);
    const roles = roleKeys.length ? roleKeys : ['ROLE_DEFAULT']; // 无角色时给默认

    // 查用户权限（admin 角色拥有全部权限）
    let permissions: string[];
    if (roleKeys.includes('admin')) {
      permissions = ['*:*:*'];
    } else {
      const permsResult: any = await this.dataSource.query(
        `SELECT DISTINCT m.perms FROM sys_menu m
           INNER JOIN sys_role_menu rm ON rm.menu_id = m.menu_id
           INNER JOIN sys_role r ON r.role_id = rm.role_id AND r.status = '0' AND r.del_flag = '0'
           INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
          WHERE ur.user_id = ? AND m.perms IS NOT NULL AND m.perms != ''`,
        [userId],
      );
      const permsRows = Array.isArray(permsResult) ? permsResult : permsResult ? [permsResult] : [];
      permissions = permsRows.map((r) => r.perms);
    }

    // 返回顶层完整响应（success() 带 code+msg，拦截器透传不包 data）
    return success({
      user: {
        userId: user.userId,
        userName: user.userName,
        nickName: user.nickName,
        avatar: user.avatar,
        email: user.email,
        phonenumber: user.phonenumber,
        sex: user.sex,
      },
      roles,
      permissions,
    });
  }

  /**
   * 退出登录：删除 Redis 会话，旧 token 立即失效
   *
   * 关键：不校验 token 是否过期。用 jwtService.decode 只解析 payload 拿 userId
   * （decode 不做签名/过期校验），所以即使 token 已过期，logout 也能成功——
   * 否则前端 token 过期后 logout 也 401，会卡在空白页无法登出。
   */
  async logout(authHeader?: string) {
    // 从 "Bearer xxx" 里取 token；没有则空
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const payload: any = token ? this.jwtService.decode(token) : null;
    const userId = payload?.userId;
    if (userId) {
      await this.redis.del(`login_token:${userId}`); // 删会话，配合守卫校验使旧 token 失效
    }
    return success(); // { code:200, msg:'操作成功' }（无 token 也幂等成功）
  }
}
