import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './common/auth/auth.module';
import { FileModule } from './common/file/file.module';

import { AdminModule } from './admin/admin.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: memoryStorage(), // 메모리 스토리지 명시적 설정
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB로 증가
        files: 10, // 최대 파일 수
      },
      fileFilter: (req, file, cb) => {
        // 기본적인 파일 필터링
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/heic',
          'image/heif',
          'image/avif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log(`차단된 파일 타입: ${file.mimetype}`);
          cb(
            new Error(`지원하지 않는 파일 형식입니다: ${file.mimetype}`),
            false,
          );
        }
      },
    }),
    AuthModule,
    DatabaseModule,
    FileModule,
    AdminModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
