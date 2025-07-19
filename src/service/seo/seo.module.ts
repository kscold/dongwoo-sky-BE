import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageSeo, PageSeoSchema } from '../../schema/page-seo.schema';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PageSeo.name, schema: PageSeoSchema }
    ])
  ],
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService]
})
export class SeoModule {}