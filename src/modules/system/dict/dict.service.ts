import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysDictType } from './entities/sys-dict-type.entity.js';
import { SysDictData } from './entities/sys-dict-data.entity.js';
import { paginate, type PageQuery } from '../../../common/utils/page.js';

/**
 * DictService：字典业务
 * - 字典类型/数据分页列表（rows/total，对齐若依 getDataTable）
 * - 按类型查字典数据（data，对齐若依 AjaxResult.success(数组)）
 */
@Injectable()
export class DictService {
  constructor(
    @InjectRepository(SysDictType)
    private readonly typeRepo: Repository<SysDictType>,
    @InjectRepository(SysDictData)
    private readonly dataRepo: Repository<SysDictData>,
  ) {}

  /** 字典类型分页列表 */
  async findTypesPage(query: PageQuery) {
    const { skip, take, order } = paginate(query);
    const [rows, total] = await this.typeRepo.findAndCount({
      where: { status: '0' },
      order,
      skip,
      take,
    });
    return { rows, total };
  }

  /** 字典数据分页列表 */
  async findDataPage(query: PageQuery) {
    const { skip, take, order } = paginate(query);
    const [rows, total] = await this.dataRepo.findAndCount({
      order,
      skip,
      take,
    });
    return { rows, total };
  }

  /** 按字典类型查数据（非分页，前端下拉框用 → data 数组） */
  async findDataByType(dictType: string) {
    return this.dataRepo.find({
      where: { dictType, status: '0' },
      order: { dictSort: 'ASC' },
    });
  }
}
