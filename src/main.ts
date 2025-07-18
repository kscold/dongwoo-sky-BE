import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';

import { GlobalExceptionFilter } from './common/filter/global-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true, // JSON 본문 파싱 활성화
  });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://dongwoo-sky.vercel.app',
      'https://*.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With, KakaoAK',
    credentials: true,
  });

  // 파일 업로드를 위한 Express 설정
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  app.setGlobalPrefix('api');

  // 전역 예외 필터 등록
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
