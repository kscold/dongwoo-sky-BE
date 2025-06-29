import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { LandingPageController } from './landing-page.controller';
import { LandingPageService } from './landing-page.service';
import {
  LandingPage,
  LandingPageSchema,
} from '../../schema/landing-page.schema';
import { AdminModule } from '../../admin/admin.module';
import { AwsModule } from '../../common/aws/aws.module';
import { AuthModule } from '../../common/auth/auth.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LandingPage.name, schema: LandingPageSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
    AdminModule,
    AwsModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [LandingPageController],
  providers: [LandingPageService],
  exports: [LandingPageService],
})
export class LandingPageModule {}
