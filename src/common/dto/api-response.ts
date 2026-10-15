/**
 * ApiResponse：统一 API 响应结构（若依风格：code/message/data）
 * code=200 成功；非 200 失败（与若依前端约定一致）
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}
