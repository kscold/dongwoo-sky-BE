import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SitemapConfig, SitemapConfigSchema } from '../../schema/sitemap-config.schema';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SitemapConfig.name, schema: SitemapConfigSchema }
    ])
  ],
  controllers: [SitemapController],
  providers: [SitemapService],
  exports: [SitemapService]
})
export class SitemapModule {}