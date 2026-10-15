# nest-ruoyi

用 **NestJS + TypeORM** 重构 **若依（RuoYi-Vue）SpringBoot 后端** 的练手项目。

目标：以若依 Java 后端为蓝本，逐模块用 NestJS 重写，直接对接若依 Vue3 前端（`RuoYi-Vue3`），保持接口路径、返回格式、权限模型一致。

---

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | NestJS 12（TypeScript, ESM） |
| ORM | TypeORM（MySQL，`synchronize: false`，直接复用若依库 `ry-vue`） |
| 认证 | JWT（`@nestjs/jwt`）+ Redis 会话（`ioredis`） |
| 校验 | class-validator + ValidationPipe |
| 接口文档 | Swagger（`@nestjs/swagger`，挂 `/api`） |
| 验证码 | svg-captcha（答案存 Redis，一次性） |
| 密码 | bcrypt |

---

## 环境要求

- Node.js（>= 18）
- MySQL（本机服务名 `MySQL57`），已导入若依库 `ry-vue`（`sql/ry_20260417.sql`）
- Redis（Docker 容器 `redis`，`localhost:6379`）

---

## 快速开始

```bash
# 1. 安装依赖（本机 npm 全环境有 edgesOut 问题，必须带这些参数）
npm install --legacy-peer-deps --no-audit --no-fund

# 2. 配置 .env（参考 .env.example，默认已配好）
PORT=8080
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=123456
DB_DATABASE=ry-vue
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=ruoyi-nest-jwt-secret-key
JWT_EXPIRES_IN=30m

# 3. 确认 Redis 容器已启动（Docker）
# 4. 启动（热更新）
npm run start:dev
```

启动后：
- 服务地址：`http://localhost:8080`
- Swagger 文档：`http://localhost:8080/api`

> 注意：`npm run start:dev` 的 `nest --watch` **不会因 `.env` 变更自动重启**，改了 `.env` 必须重启进程才生效。

---

## 已完成功能（当前进度）

### 1. 地基
- [x] 连接若依主库 `ry-vue`（TypeORM，`synchronize:false` 绝不动表）
- [x] 统一响应拦截器 `TransformInterceptor` + 全局异常过滤器 `HttpExceptionFilter`
- [x] Swagger 挂 `/api`，带 Bearer 认证
- [x] 健康检查 `GET /`

### 2. 认证
- [x] 登录 `POST /login`（验证码校验 → 查用户 → bcrypt 比对 → 签 JWT → 存 Redis 会话）
- [x] 验证码 `GET /captchaImage`（svg-captcha，答案存 Redis `captcha_codes:{uuid}`，TTL 120s，一次性）
- [x] 用户信息 `GET /getInfo`（顶层返回 `{user, roles, permissions}`）
- [x] 退出登录 `POST /logout`（不挂守卫，用 `jwtService.decode` 删 Redis 会话，token 过期也能登出）

### 3. RBAC 权限
- [x] 自定义装饰器 `@RequiresPermissions('system:user:list')` + 守卫 `PermissionsGuard`
- [x] 权限五表联动（`sys_user_role` → `sys_role` → `sys_role_menu` → `sys_menu`），admin 放行 `*:*:*`
- [x] 动态路由 `GET /getRouters`（菜单树组装，`Layout`/`ParentView`/组件串）

### 4. 系统管理
- [x] **部门** `GET /system/dept/list`（平铺）、`/treeselect`（树）
- [x] **岗位** `GET /system/post/list`（分页 rows/total）
- [x] **字典** `GET /system/dict/type/list`、`/data/list`（分页）、`/data/type/{type}`（下拉）
- [x] **公告** `GET /system/notice/listTop`（首页公告栏）
- [x] **参数配置** `GET /system/config/configKey/{key}`（如 `sys.user.initPassword`）
- [x] **用户管理**：
  - `GET /system/user/list`（分页）
  - `GET /system/user/deptTree`（部门树）
  - `GET /system/user/{id}`（详情，返回 `{data:{user, roles, posts}}`，排除 password）
  - `POST /system/user`（新增，密码默认用初始密码 BCrypt 加密 + 写角色/岗位关联）
  - `PUT /system/user`（修改，重写关联）
  - `DELETE /system/user/{ids}`（逻辑删 `del_flag='2'` + 删关联）
  - `PUT /system/user/resetPwd`（重置密码）
  - `PUT /system/user/changeStatus`（改状态）

### 5. 前端对接
- [x] 登录页验证码前缀改为 `data:image/svg+xml`（若依前端写死 gif）
- [x] `request.js` error 分支：读后端 `msg`，401 弹框登出
- [x] 统一状态码规范（见下）

---

## 统一响应格式 & 状态码规范

### 分页列表（对齐若依 `TableDataInfo`）
```json
{ "code": 200, "msg": "查询成功", "rows": [...], "total": 10 }
```
分页参数：`pageNum`、`pageSize`、`orderByColumn`、`isAsc`（兼容 `ascending/descending`）。

### 详情/单条（包 data）
```json
{ "code": 200, "msg": "操作成功", "data": { "user": {...}, "roles": [...], "posts": [...] } }
```

### 登录等业务返回（顶层透传，对齐若依 AjaxResult）
```json
{ "code": 200, "msg": "操作成功", "token": "..." }
```

### 状态码（极简规范，全局统一）
| 状态码 | 含义 | 前端行为 |
|---|---|---|
| 200 | 成功 | 正常 |
| 400 | 业务失败（验证码错/密码错/用户不存在停用/重复等统一） | 弹 msg，不登出 |
| 401 | 认证失效（token 没带/过期/会话没了） | 弹 msg + 登出回登录页 |
| 403 | 无权限（PermissionsGuard） | 弹提示，不登出 |
| 500 | 服务器内部错误 | 弹提示 |

> 关键设计：后端用真实 HTTP 状态码（401/400/403/500），axios 会把 4xx/5xx 归为错误响应走 error 分支，所以前端 `request.js` 的 **error 分支**必须处理 401（读 `error.response.data.msg` 并触发登出）。

---

## 目录结构

```
src/
├── main.ts                    # 启动：CORS + ValidationPipe + 全局拦截器/过滤器 + Swagger
├── app.module.ts              # 根模块：连库 + 各业务模块
├── common/
│   ├── utils/
│   │   ├── api-response.ts    # success() 顶层响应
│   │   └── page.ts            # 分页工具 paginate() / pageResult()
│   ├── interceptors/transform.interceptor.ts   # 统一响应：对象含 code+msg 透传，否则包 data
│   └── filters/http-exception.filter.ts        # 全局异常：输出 {code,msg,data:null}
└── modules/
    ├── auth/                  # 登录/JWT/Redis会话/验证码/权限装饰器+守卫
    ├── health/                # 健康检查
    └── system/
        ├── user/              # 用户管理（CRUD + 角色岗位回显）
        ├── role/              # 角色实体（RBAC）
        ├── menu/              # 菜单实体 + 动态路由
        ├── dept/              # 部门
        ├── post/              # 岗位
        ├── dict/              # 字典类型/数据
        ├── notice/            # 公告
        └── config/            # 参数配置
```

每个业务模块统一 4 个文件：`entities/*.entity.ts`（实体）、`*.service.ts`（业务）、`*.controller.ts`（路由）、`*.module.ts`（模块）。

---

## 模块依赖约定

- 用守卫（`JwtAuthGuard`/`PermissionsGuard`）的模块要 `imports: AuthModule`（AuthModule `exports: [JwtModule, RedisService]`）
- 新实体必须加进 `app.module.ts` 的全局 `entities` 列表（否则 `No metadata` 报错）
- 权限守卫跨模块：`@RequiresPermissions('xxx:yyy:zzz')` 声明，`PermissionsGuard` 校验

---

## 当前进度 & 待办

### 已完成 ✅
基础框架 / 认证闭环 / RBAC / 部门 / 岗位 / 字典 / 公告 / 配置 / 用户管理（完整 CRUD）/ 动态路由 / 前端 request 与登录验证码对接

### 待迁移 🔜（按优先级）
- [ ] **角色管理**（CRUD + 分配菜单权限 + 数据权限）
- [ ] **菜单管理**（CRUD + 菜单树）
- [ ] **个人中心**（`/system/user/profile`、`/updatePwd`、`/unlockscreen`、`/register`）
- [ ] **日志**（操作日志 `/monitor/operlog`、登录日志 `/monitor/logininfor`）
- [ ] **在线用户**（`/monitor/online`）
- [ ] **通知公告管理**（完整 CRUD，目前只有 listTop）
- [ ] **定时任务**（`/monitor/job`，需要 `ry-quartz` 库 + `@nestjs/schedule` 多数据源）
- [ ] **文件上传/下载**（`/common/upload`）
- [ ] **代码生成 / 表单构建**（`/tool/gen`、`/tool/build`）

---

## 踩坑记录

- `npm install` 必现 `edgesOut` 错误，必须 `--legacy-peer-deps --no-audit --no-fund`
- `ioredis` 默认导入不可构造，须 `import { Redis } from 'ioredis'`
- `bcrypt` 需 `@types/bcrypt`，`import * as bcrypt`
- TypeORM `dataSource.query` 返回对象或数组均可能，须 `Array.isArray` 兼容
- MySQL `bigint` 返回字符串，比较前须 `Number()`
- 装饰器签名类型须 `import type`（esbuild isolatedModules）
- `nest --watch` 热更新不监听 `.env` 变化，改配置须重启
- 旧 `start:dev` 进程可能残留占用 8080，改配置后先清端口再重启

---

## License

MIT（练手项目）
