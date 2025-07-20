import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminSitemapController } from './admin-sitemap.controller';

import { AdminSitemapService } from './admin-sitemap.service';

import {
    SitemapConfig,
    SitemapConfigSchema,
} from '../../schema/sitemap-config.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SitemapConfig.name, schema: SitemapConfigSchema },
        ]),
    ],
    controllers: [AdminSitemapController],
    providers: [AdminSitemapService],
    exports: [AdminSitemapService],
})
export class AdminSitemapModule {}
