import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerReviewController } from './customer-review.controller';
import { CustomerReviewService } from './customer-review.service';
import {
  CustomerReview,
  CustomerReviewSchema,
} from '../../schema/customer-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerReview.name, schema: CustomerReviewSchema },
    ]),
  ],
  controllers: [CustomerReviewController],
  providers: [CustomerReviewService],
})
export class CustomerReviewModule {}
