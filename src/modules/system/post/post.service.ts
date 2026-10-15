import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysPost } from './entities/sys-post.entity.js';
import { paginate, type PageQuery } from '../../../common/utils/page.js';

/**
 * PostService：岗位业务
 */
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private readonly postRepo: Repository<SysPost>,
  ) {}

  /**
   * 分页查询岗位列表（对齐若依 SysPostController.list → rows/total）
   */
  async findPage(query: PageQuery) {
    const { skip, take, order } = paginate(query);
    const [rows, total] = await this.postRepo.findAndCount({
      order,
      skip,
      take,
    });
    return { rows, total };
  }
}
