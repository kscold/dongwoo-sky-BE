import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SitemapConfig, SitemapConfigSchema } from '../../schema/sitemap-config.schema';
import { AdminSitemapController } from './admin-sitemap.controller';
import { AdminSitemapService } from './admin-sitemap.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SitemapConfig.name, schema: SitemapConfigSchema }
    ])
  ],
  controllers: [AdminSitemapController],
  providers: [AdminSitemapService],
  exports: [AdminSitemapService]
})
export class AdminSitemapModule {}