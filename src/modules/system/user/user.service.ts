import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysUser } from './entities/sys-user.entity.js';
import { SysUserPost } from './entities/sys-user-post.entity.js';
import { SysUserRole } from '../role/entities/sys-user-role.entity.js';
import { paginate, type PageQuery } from '../../../common/utils/page.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';

/**
 * UserService：用户业务（对齐若依 SysUserServiceImpl）
 * - 分页列表 rows/total
 * - 详情（含角色 roleIds / 岗位 postIds 回显）
 * - 新增/修改（BCrypt 密码 + 维护 sys_user_role / sys_user_post 关联）
 * - 删除（逻辑删 del_flag='2'）、重置密码、改状态
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private readonly userRepo: Repository<SysUser>,
    @InjectRepository(SysUserPost)
    private readonly userPostRepo: Repository<SysUserPost>,
    @InjectRepository(SysUserRole)
    private readonly userRoleRepo: Repository<SysUserRole>,
    private readonly dataSource: DataSource,
  ) {}

  /** 分页查询用户列表（只查未删除 del_flag='0'，对齐若依 selectUserList） */
  async findPage(query: PageQuery) {
    const { skip, take, order } = paginate(query);
    const [rows, total] = await this.userRepo.findAndCount({
      // 只返回非敏感字段（密码/盐不返回）+ 过滤逻辑删除
      where: { delFlag: '0' },
      select: {
        userId: true,
        userName: true,
        nickName: true,
        status: true,
        deptId: true,
        phonenumber: true,
        createTime: true,
      },
      skip,
      take,
      order,
    });
    return { rows, total };
  }

  /**
   * 用户详情（对齐若依 SysUserController.getInfo）
   * 返回 { user, roles, posts }：
   *   user   用户信息（含 roleIds 用于回显，已排除 password）
   *   roles  完整角色对象数组（roleId/roleName/roleKey，前端下拉）
   *   posts  完整岗位对象数组（postId/postName/postCode，前端下拉）
   */
  async findOne(userId: number) {
    const user = await this.userRepo.findOne({ where: { userId, delFlag: '0' } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    // 查该用户的完整角色对象（对齐若依 roleService.selectRolesByUserId）
    const rolesResult: any = await this.dataSource.query(
      `SELECT r.role_id, r.role_name, r.role_key FROM sys_role r
         INNER JOIN sys_user_role ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ? AND r.del_flag = '0'`,
      [userId],
    );
    const roles = (Array.isArray(rolesResult) ? rolesResult : rolesResult ? [rolesResult] : []).map(
      (r: any) => ({ roleId: Number(r.role_id), roleName: r.role_name, roleKey: r.role_key }),
    );

    // 查该用户的完整岗位对象（对齐若依 postService.selectPostsByUserId）
    const postsResult: any = await this.dataSource.query(
      `SELECT p.post_id, p.post_name, p.post_code FROM sys_post p
         INNER JOIN sys_user_post up ON up.post_id = p.post_id
        WHERE up.user_id = ?`,
      [userId],
    );
    const posts = (Array.isArray(postsResult) ? postsResult : postsResult ? [postsResult] : []).map(
      (p: any) => ({ postId: Number(p.post_id), postName: p.post_name, postCode: p.post_code }),
    );

    // user 里带上 roleIds 供前端回显选中；排除 password 防止泄露哈希
    const roleIds = roles.map((r) => r.roleId);
    const { password, ...safeUser } = user;
    return { user: { ...safeUser, roleIds }, roles, posts };
  }

  /** 新增用户：密码 BCrypt 加密 + 保存关联 */
  async create(dto: CreateUserDto) {
    // 密码默认用 sys.user.initPassword（可传覆盖），BCrypt 加密
    const initPwd = dto.password || (await this.getInitPassword());
    const password = await bcrypt.hash(initPwd, 10);
    const user = await this.userRepo.save({
      deptId: dto.deptId,
      userName: dto.userName,
      nickName: dto.nickName,
      email: dto.email,
      phonenumber: dto.phonenumber,
      sex: dto.sex ?? '0',
      status: dto.status ?? '0',
      password,
      delFlag: '0',
      createTime: new Date(),
      remark: dto.remark,
    });
    // 保存角色/岗位关联
    await this.saveRelations(user.userId, dto.roleIds ?? [], dto.postIds ?? []);
    return { userId: user.userId };
  }

  /** 修改用户：更新字段 + 重写角色/岗位关联 */
  async update(dto: UpdateUserDto) {
    const exists = await this.userRepo.findOne({ where: { userId: dto.userId } });
    if (!exists) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    await this.userRepo.update(dto.userId, {
      deptId: dto.deptId,
      nickName: dto.nickName,
      email: dto.email,
      phonenumber: dto.phonenumber,
      sex: dto.sex,
      status: dto.status,
      updateTime: new Date(),
      remark: dto.remark,
    });
    // 重写关联：先删旧，再插新
    await this.userRoleRepo.delete({ userId: dto.userId });
    await this.userPostRepo.delete({ userId: dto.userId });
    await this.saveRelations(dto.userId, dto.roleIds ?? [], dto.postIds ?? []);
  }

  /** 删除用户（可批量，逗号分隔）：逻辑删 del_flag='2' + 删关联 */
  async remove(userIds: number[]) {
    for (const id of userIds) {
      await this.userRepo.update(id, { delFlag: '2', updateTime: new Date() });
      await this.userRoleRepo.delete({ userId: id });
      await this.userPostRepo.delete({ userId: id });
    }
  }

  /** 重置密码：新密码 BCrypt 加密 */
  async resetPwd(userId: number, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    await this.userRepo.update(userId, { password: hashed, updateTime: new Date() });
  }

  /** 修改状态：0正常 / 1停用 */
  async changeStatus(userId: number, status: string) {
    await this.userRepo.update(userId, { status, updateTime: new Date() });
  }

  /** 读 sys.user.initPassword 配置（初始密码，默认 123456） */
  private async getInitPassword(): Promise<string> {
    const r: any = await this.dataSource.query(
      `SELECT config_value FROM sys_config WHERE config_key = 'sys.user.initPassword'`,
    );
    const row = Array.isArray(r) ? r[0] : r;
    return row?.config_value ?? '123456';
  }

  /** 批量写角色/岗位关联 */
  private async saveRelations(userId: number, roleIds: number[], postIds: number[]) {
    for (const rid of roleIds) {
      await this.userRoleRepo.save({ userId, roleId: rid });
    }
    for (const pid of postIds) {
      await this.userPostRepo.save({ userId, postId: pid });
    }
  }
}
