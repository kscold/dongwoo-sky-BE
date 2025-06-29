import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { S3Service } from './file/s3.service';
import { FileService } from './file/file.service';
import { FileToWebpService } from './file/file-to-webp.service';

@Module({
  imports: [ConfigModule],
  providers: [S3Service, FileService, FileToWebpService],
  exports: [FileService],
})
export class CommonModule {}
