import { HttpStatus } from '@nestjs/common';

/** 成功状态码（200），全局唯一来源 */
export const CODE_SUCCESS = HttpStatus.OK;

/** 成功提示文案，全局唯一来源 */
export const MSG_SUCCESS = '操作成功';

/**
 * 构造顶层成功响应：{ code:200, msg, ...payload }
 *
 * 用法（对齐若依 AjaxResult.success()）：
 *   success({ token })                       → { code:200, msg:'操作成功', token }
 *   success({ user, roles, permissions })    → { code:200, msg:'操作成功', user, roles, permissions }
 *   success({ captchaEnabled, uuid, img })   → { code:200, msg:'操作成功', captchaEnabled, uuid, img }
 *
 * 因为返回对象带 code + msg，TransformInterceptor 会判定为"完整响应"而透传（不包 data），
 * 前端能直接读顶层字段（res.token / res.user / res.captchaEnabled ...）。
 */
export function success(
  payload: Record<string, unknown> = {},
  msg: string = MSG_SUCCESS,
) {
  return { code: CODE_SUCCESS, msg, ...payload };
}
