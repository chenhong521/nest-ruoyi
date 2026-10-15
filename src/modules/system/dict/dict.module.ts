import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module.js';
import { SysDictType } from './entities/sys-dict-type.entity.js';
import { SysDictData } from './entities/sys-dict-data.entity.js';
import { DictController } from './dict.controller.js';
import { DictService } from './dict.service.js';

/**
 * DictModule：字典模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([SysDictType, SysDictData]), AuthModule],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
