import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SitemapConfig, SitemapConfigDocument } from '../../schema/sitemap-config.schema';

@Injectable()
export class SitemapService {
  constructor(
    @InjectModel(SitemapConfig.name) private sitemapConfigModel: Model<SitemapConfigDocument>
  ) {}

  async generateSitemap(): Promise<string> {
    const configs = await this.sitemapConfigModel
      .find({ 
        isActive: true, 
        includeInSitemap: true,
        allowRobots: true
      })
      .sort({ sortOrder: 1 })
      .exec();

    const baseUrl = process.env.FRONTEND_URL || 'https://dongwoo-sky.com';
    
    const urls = configs.map(config => {
      const fullUrl = config.url.startsWith('http') ? config.url : `${baseUrl}${config.url}`;
      const lastMod = config.lastModified ? 
        config.lastModified.toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0];
      
      return `  <url>
    <loc>${this.escapeXml(fullUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  async generateRobotsTxt(): Promise<string> {
    const baseUrl = process.env.FRONTEND_URL || 'https://dongwoo-sky.com';
    
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin pages
Disallow: /admin/
Disallow: /api/admin/

# Disallow private files
Disallow: /private/
Disallow: /.env
Disallow: /config/

# Allow common files
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /favicon.ico
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.webp
Allow: /*.svg`;

    return robotsTxt;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}