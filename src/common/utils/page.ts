/**
 * 分页工具：对齐若依 TableSupport + TableDataInfo
 *
 * 若依分页列表接口：
 *   请求参数：pageNum(当前页,默认1) / pageSize(每页条数,默认10) / orderByColumn(排序列) / isAsc(asc|desc)
 *   返回格式：{ code:200, msg:'查询成功', rows:[...], total:N }   ← 前端读 res.rows / res.total
 *
 * 用法：
 *   const { skip, take, order } = paginate({ pageNum, pageSize, orderByColumn, isAsc });
 *   const [rows, total] = await repo.findAndCount({ skip, take, order });
 *   return pageResult(rows, total);
 */

/** 分页查询参数（来自前端 query） */
export interface PageQuery {
  pageNum?: number | string;
  pageSize?: number | string;
  /** 排序列（驼峰，如 createTime） */
  orderByColumn?: string;
  /** 排序方向：asc / desc（兼容前端 ascending / descending） */
  isAsc?: string;
}

/**
 * 解析分页参数 → TypeORM 的 skip/take/order
 * - pageNum 至少 1，pageSize 默认 10
 * - isAsc 兼容若依前端传的 ascending / descending
 */
export function paginate(query: PageQuery = {}) {
  const pageNum = Math.max(1, Number(query.pageNum) || 1);
  const pageSize = Math.max(1, Number(query.pageSize) || 10);
  const skip = (pageNum - 1) * pageSize;
  const take = pageSize;

  // 排序列：前端传驼峰（createTime），TypeORM order 直接按实体属性名
  let rawAsc = String(query.isAsc ?? 'asc').toLowerCase();
  if (rawAsc === 'ascending') rawAsc = 'asc';
  if (rawAsc === 'descending') rawAsc = 'desc';
  const order: Record<string, 'ASC' | 'DESC'> = {};
  if (query.orderByColumn) {
    order[query.orderByColumn] = rawAsc === 'desc' ? 'DESC' : 'ASC';
  }
  return { skip, take, order };
}

/**
 * 组装分页成功响应：{ code, msg:'查询成功', rows, total }
 * 带 code+msg，TransformInterceptor 判定为完整响应而透传（前端直接读 rows/total）
 */
export function pageResult(rows: unknown[], total: number) {
  return { code: 200, msg: '查询成功', rows, total };
}
