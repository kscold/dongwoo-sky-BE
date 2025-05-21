import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { ImageService } from './image.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [FileService, ImageService],
  exports: [FileService, ImageService],
})
export class CommonModule {}
