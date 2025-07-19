import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('meta-tags')
  async getMetaTags(@Query('url') url: string): Promise<{ metaTags: string }> {
    if (!url) {
      throw new NotFoundException('URL parameter is required');
    }
    
    const metaTags = await this.seoService.getMetaTagsByUrl(url);
    return { metaTags };
  }

  @Get('page-data')
  async getPageSeoData(@Query('url') url: string): Promise<any> {
    if (!url) {
      throw new NotFoundException('URL parameter is required');
    }
    
    return this.seoService.getPageSeoData(url);
  }

  @Get('structured-data')
  async getStructuredData(@Query('url') url: string): Promise<any> {
    if (!url) {
      throw new NotFoundException('URL parameter is required');
    }
    
    return this.seoService.getStructuredData(url);
  }
}