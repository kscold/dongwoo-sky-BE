import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { NoticeModule } from './notice/notice.module';
import { PricingModule } from './pricing/pricing.module';
import { ServiceGuideModule } from './service-guide/service-guide.module';
import { WorkShowcaseModule } from './work-showcase/work-showcase.module';
import { CustomerReviewModule } from './customer-review/customer-review.module';
import { SiteSettingModule } from './site-setting/site-setting.module';
import { ContactModule } from './contact/contact.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [
    NoticeModule,
    HomeModule,
    PricingModule,
    ServiceGuideModule,
    WorkShowcaseModule,
    CustomerReviewModule,
    SiteSettingModule,
    ContactModule,
    SitemapModule,
    SeoModule,
  ],
})
export class ServiceModule { }

