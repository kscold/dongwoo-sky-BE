import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerReviewService } from './customer-review.service';
import { CustomerReview, CustomerReviewSchema } from '../../schema/customer-review.schema';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerReview.name, schema: CustomerReviewSchema },
    ]),
    FileModule,
  ],
  providers: [CustomerReviewService],
  exports: [CustomerReviewService],
})
export class CommonServiceModule {}