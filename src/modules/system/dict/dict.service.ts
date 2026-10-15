import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysDictType } from './entities/sys-dict-type.entity.js';
import { SysDictData } from './entities/sys-dict-data.entity.js';

/**
 * DictService：字典业务
 * - 字典类型列表（dict/type/list）
 * - 按类型查字典数据（dict/data/type/{type}，前端下拉框核心接口）
 */
@Injectable()
export class DictService {
  constructor(
    @InjectRepository(SysDictType)
    private readonly typeRepo: Repository<SysDictType>,
    @InjectRepository(SysDictData)
    private readonly dataRepo: Repository<SysDictData>,
  ) {}

  /** 字典类型列表 */
  findAllTypes() {
    return this.typeRepo.find({
      where: { status: '0' },
      order: { dictId: 'ASC' },
    });
  }

  /** 按字典类型查数据（前端下拉框用） */
  async findDataByType(dictType: string) {
    return this.dataRepo.find({
      where: { dictType, status: '0' },
      order: { dictSort: 'ASC' },
    });
  }

  /** 全部字典数据列表 */
  findAllData() {
    return this.dataRepo.find({ order: { dictType: 'ASC', dictSort: 'ASC' } });
  }
}
