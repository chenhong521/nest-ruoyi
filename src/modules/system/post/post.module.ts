import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { SysPost } from './entities/sys-post.entity.js';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';

/**
 * PostModule：岗位模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysPost]), AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
