import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUser } from './entities/sys-user.entity.js';

/**
 * UserService：用户业务（演示 RBAC 用）
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private readonly userRepo: Repository<SysUser>,
  ) {}

  /** 查询用户列表（只返回非敏感字段） */
  findAll() {
    return this.userRepo.find({
      select: {
        userId: true,
        userName: true,
        nickName: true,
        status: true,
      },
    });
  }
}
