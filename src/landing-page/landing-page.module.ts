import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LandingPageController } from './landing-page.controller';
import { LandingPageService } from './landing-page.service';
import { LandingPage, LandingPageSchema } from './schemas/landing-page.schema';
import { AdminModule } from '../admin/admin.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LandingPage.name, schema: LandingPageSchema },
    ]),
    AdminModule,
    AwsModule,
  ],
  controllers: [LandingPageController],
  providers: [LandingPageService],
  exports: [LandingPageService],
})
export class LandingPageModule {}
