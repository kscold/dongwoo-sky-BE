import { Module } from '@nestjs/common';
import { FileService } from './service/file.service';
import { ImageService } from './service/image.service';
import { FilesController } from './controller/files.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [FilesController],
  providers: [FileService, ImageService],
  exports: [FileService, ImageService],
})
export class CommonModule {}
