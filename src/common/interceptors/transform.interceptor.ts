import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.js';
import { CODE_SUCCESS, MSG_SUCCESS } from '../utils/api-response.js';

/**
 * TransformInterceptor：全局【成功】响应拦截器
 * 把所有成功返回统一包成 { code:200, message, data }（若依前端兼容格式）
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: any) => {
        // 透传：若返回对象已自带 code+message/msg（完整响应，如 captchaImage），不包 data
        // 保证若依前端能直接读 res.captchaEnabled / res.img / res.uuid 等顶层字段
        if (
          data &&
          typeof data === 'object' &&
          'code' in data &&
          ('message' in data || 'msg' in data)
        ) {
          return data;
        }
        // 默认包装：普通接口统一成 { code:200, msg, data }（对齐若依，前端读 res.data.msg）
        return { code: CODE_SUCCESS, msg: MSG_SUCCESS, data: data ?? null };
      }),
    );
  }
}
