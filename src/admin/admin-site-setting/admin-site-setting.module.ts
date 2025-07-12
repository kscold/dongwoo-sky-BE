import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SiteSetting, SiteSettingSchema } from '../../schema/site-setting.schema';

import { AdminSiteSettingController } from './admin-site-setting.controller';

import { AdminSiteSettingService } from './admin-site-setting.service';
import { AdminAuthGuard } from '../../common/guard/admin-auth.guard';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: SiteSetting.name, schema: SiteSettingSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminSiteSettingController],
  providers: [AdminSiteSettingService, AdminAuthGuard],
})
export class AdminSiteSettingModule { }
