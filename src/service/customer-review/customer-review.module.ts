import { Module } from '@nestjs/common';
import { CustomerReviewController } from './customer-review.controller';
import { CommonServiceModule } from '../../common/service/common-service.module';

@Module({
  imports: [CommonServiceModule],
  controllers: [CustomerReviewController],
})
export class CustomerReviewModule {}
