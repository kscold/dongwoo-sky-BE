import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { NoticesModule } from './notices/notices.module';
import { AwsModule } from './aws/aws.module';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ServiceModule } from './service/service.module';
import { ProfileModule } from './profile/profile.module';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    NoticesModule,
    AwsModule,
    CommonModule,
    AdminModule,
    EquipmentModule,
    ServiceModule,
    ProfileModule,
    VehicleTypeModule,
    LandingPageModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
