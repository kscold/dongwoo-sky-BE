import { Module } from '@nestjs/common';
import { ContactModule } from './contact/contact.module';
import { HomeModule } from './home/home.module';
import { NoticeModule } from './notice/notice.module';
import { PricingModule } from './pricing/pricing.module';
import { ServiceGuideModule } from './service-guide/service-guide.module';
import { WorkShowcaseModule } from './work-showcase/work-showcase.module';
import { CustomerReviewModule } from './customer-review/customer-review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ContactModule,
    HomeModule,
    NoticeModule,
    PricingModule,
    ServiceGuideModule,
    WorkShowcaseModule,
    CustomerReviewModule,
    UserModule,
  ],
})
export class ServiceModule {}

