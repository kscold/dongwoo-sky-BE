import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SitemapService } from './sitemap.service';

@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  async getSitemap(@Res() res: Response): Promise<void> {
    try {
      const sitemapXml = await this.sitemapService.generateSitemap();
      
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1시간 캐시
      res.status(HttpStatus.OK).send(sitemapXml);
    } catch (error) {
      console.error('Sitemap generation failed:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap generation failed</error>');
    }
  }

  @Get('robots.txt')
  async getRobots(@Res() res: Response): Promise<void> {
    try {
      const robotsTxt = await this.sitemapService.generateRobotsTxt();
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24시간 캐시
      res.status(HttpStatus.OK).send(robotsTxt);
    } catch (error) {
      console.error('Robots.txt generation failed:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('# Robots.txt generation failed');
    }
  }
}