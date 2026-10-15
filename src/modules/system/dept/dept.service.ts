import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysDept } from './entities/sys-dept.entity.js';

/**
 * DeptService：部门业务
 * - findAll：返回全部部门（平铺，前端 tree 组件自己组树）
 * - treeselect：返回组装好的部门树（下拉框/选择父级用）
 */
@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(SysDept)
    private readonly deptRepo: Repository<SysDept>,
  ) {}

  /** 查询全部有效部门（del_flag='0'），按父级+排序 */
  findAll() {
    return this.deptRepo.find({
      where: { delFlag: '0' },
      order: { parentId: 'ASC', orderNum: 'ASC' },
    });
  }

  /** 部门树（treeselect 用）：组装成 { id, label, children } 结构 */
  async treeselect() {
    const depts = await this.findAll();
    return this.buildTree(depts, 0);
  }

  /** 递归组树：id=部门ID，label=部门名 */
  private buildTree(depts: SysDept[], parentId: number): any[] {
    const nodes: any[] = [];
    for (const d of depts) {
      // MySQL bigint 返回字符串，转 number 比较
      if (Number(d.parentId) !== parentId) continue;
      const children = this.buildTree(depts, Number(d.deptId));
      const node: any = { id: d.deptId, label: d.deptName };
      if (children.length) node.children = children;
      nodes.push(node);
    }
    return nodes;
  }
}
