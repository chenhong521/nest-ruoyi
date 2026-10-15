import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysConfig } from './entities/sys-config.entity.js';

/**
 * ConfigService：参数配置业务
 */
@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private readonly configRepo: Repository<SysConfig>,
  ) {}

  /** 按配置键查值（如 sys.user.initPassword → '123456'），无则返回空串 */
  async findValueByKey(configKey: string) {
    const row = await this.configRepo.findOne({ where: { configKey } });
    return row?.configValue ?? '';
  }
}
