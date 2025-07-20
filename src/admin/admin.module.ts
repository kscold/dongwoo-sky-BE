import { Module, forwardRef } from '@nestjs/common';

import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminHomeModule } from './admin-home/admin-home.module';
import { AdminContactModule } from './admin-contact/admin-contact.module';
import { AdminNoticeModule } from './admin-notice/admin-notice.module';
import { AdminServiceGuideModule } from './admin-service-guide/admin-service-guide.module';
import { AdminSiteSettingModule } from './admin-site-setting/admin-site-setting.module';
import { AdminEquipmentModule } from './admin-equipment/admin-equipment.module';
import { AdminWorkShowcaseModule } from './admin-work-showcase/admin-work-showcase.module';
import { AdminPricingSettingModule } from './admin-pricing-setting/admin-pricing-setting.module';
import { AdminCustomerReviewModule } from './admin-customer-review/admin-customer-review.module';
import { AdminStatsModule } from './admin-stats/admin-stats.module';
import { AdminSitemapModule } from './admin-sitemap/admin-sitemap.module';
import { AdminSeoModule } from './admin-seo/admin-seo.module';

@Module({
    imports: [
        forwardRef(() => AdminUserModule),
        forwardRef(() => AdminSiteSettingModule),
        AdminEquipmentModule,
        AdminWorkShowcaseModule,
        AdminPricingSettingModule,
        AdminCustomerReviewModule,
        AdminStatsModule,
        AdminSitemapModule,
        AdminSeoModule,
        AdminHomeModule,
        AdminContactModule,
        AdminNoticeModule,
        AdminServiceGuideModule,
    ],
})
export class AdminModule {}
