import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { S3Service } from './s3.service';
import { FileToWebpService } from './file-to-webp.service';

@Module({
  controllers: [FileController],
  providers: [FileService, S3Service, FileToWebpService],
  exports: [FileService, S3Service, FileToWebpService],
})
export class FileModule {}