import { Module } from '@nestjs/common';

import { AdminUserModule } from './admin-user/admin-user.module'; 
import { AdminSiteSettingModule } from './admin-site-setting/admin-site-setting.module';
import { AdminHomeModule } from './admin-home/admin-home.module'; 
import { AdminProfileModule } from './admin-profile/admin-profile.module';
import { AdminContactModule } from './admin-contact/admin-contact.module'; 

@Module({
  imports: [
    AdminUserModule,
    AdminSiteSettingModule,
    AdminHomeModule,
    AdminProfileModule,
    AdminContactModule,
  ],
})
export class AdminModule {}

