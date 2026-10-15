import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysPost } from './entities/sys-post.entity.js';

/**
 * PostService：岗位业务
 */
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private readonly postRepo: Repository<SysPost>,
  ) {}

  /** 查询全部岗位，按排序 */
  findAll() {
    return this.postRepo.find({ order: { postSort: 'ASC' } });
  }

  /** 查询启用的岗位（status='0'），用于用户下拉 */
  findEnabled() {
    return this.postRepo.find({ where: { status: '0' }, order: { postSort: 'ASC' } });
  }
}
