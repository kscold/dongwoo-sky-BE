import { Controller, Get, Query } from '@nestjs/common';

import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
    constructor(private readonly seoService: SeoService) {}

    @Get('meta-tags')
    async getMetaTags(
        @Query('url') url: string,
    ): Promise<{ metaTags: string }> {
        const metaTags = await this.seoService.getMetaTagsByUrl(url);
        return { metaTags };
    }

    @Get('page-data')
    async getPageSeoData(@Query('url') url: string): Promise<any> {
        return this.seoService.getPageSeoData(url);
    }

    @Get('structured-data')
    async getStructuredData(@Query('url') url: string): Promise<any> {
        return this.seoService.getStructuredData(url);
    }
}
