import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import {
  WorkShowcase,
  WorkShowcaseSchema,
} from './schemas/work-showcase.schema';
import {
  CustomerReview,
  CustomerReviewSchema,
} from './schemas/customer-review.schema';
import {
  ContentSettings,
  ContentSettingsSchema,
} from './schemas/content-settings.schema';
import { AwsModule } from '../aws/aws.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkShowcase.name, schema: WorkShowcaseSchema },
      { name: CustomerReview.name, schema: CustomerReviewSchema },
      { name: ContentSettings.name, schema: ContentSettingsSchema },
    ]),
    AwsModule,
    AdminModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
