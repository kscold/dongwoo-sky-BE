import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SitemapController } from './sitemap.controller';

import { SitemapService } from './sitemap.service';

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
    controllers: [SitemapController],
    providers: [SitemapService],
    exports: [SitemapService],
})
export class SitemapModule {}
