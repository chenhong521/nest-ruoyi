import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * HttpExceptionFilter：全局【异常】过滤器
 * 把抛出的异常统一转成若依风格 { code, message, data:null }
 * HTTP 状态码与业务 code 一致（401/403/404/500...）
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 500;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = status;
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message ?? exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({ code, msg: message, data: null });
  }
}
