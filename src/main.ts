import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许前端跨域调用
  app.enableCors();

  // 全局 DTO 校验（class-validator）
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 全局统一响应：成功包 code:200，失败统一格式
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // ===== Swagger API 文档 =====
  const swaggerConfig = new DocumentBuilder()
    .setTitle('若依 NestJS 重构')
    .setDescription('RuoYi-Nest 重构版接口文档')
    .setVersion('1.0')
    .addBearerAuth() // 支持在文档里带 token 测试受保护接口
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document); // 浏览器访问 /api

  await app.listen(process.env.PORT ?? 8080);
}
await bootstrap();
