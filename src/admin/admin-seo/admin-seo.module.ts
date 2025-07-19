import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageSeo, PageSeoSchema } from '../../schema/page-seo.schema';
import { AdminSeoController } from './admin-seo.controller';
import { AdminSeoService } from './admin-seo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PageSeo.name, schema: PageSeoSchema }]),
  ],
  controllers: [AdminSeoController],
  providers: [AdminSeoService],
  exports: [AdminSeoService],
})
export class AdminSeoModule {}
