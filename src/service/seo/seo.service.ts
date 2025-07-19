import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageSeo, PageSeoDocument } from '../../schema/page-seo.schema';

@Injectable()
export class SeoService {
  constructor(
    @InjectModel(PageSeo.name) private pageSeoModel: Model<PageSeoDocument>
  ) {}

  async getMetaTagsByUrl(url: string): Promise<string> {
    const seoData = await this.pageSeoModel.findOne({ url, isActive: true }).exec();
    
    if (!seoData) {
      return this.generateDefaultMetaTags(url);
    }

    return this.buildMetaTags(seoData);
  }

  async getPageSeoData(url: string): Promise<any> {
    const seoData = await this.pageSeoModel.findOne({ url, isActive: true }).exec();
    
    if (!seoData) {
      throw new NotFoundException(`SEO data for URL ${url} not found`);
    }

    return {
      pageTitle: seoData.pageTitle,
      metaTitle: seoData.metaTitle,
      metaDescription: seoData.metaDescription,
      metaKeywords: seoData.metaKeywords,
      canonicalUrl: seoData.canonicalUrl,
      ogTitle: seoData.ogTitle,
      ogDescription: seoData.ogDescription,
      ogImage: seoData.ogImage,
      ogType: seoData.ogType,
      ogUrl: seoData.ogUrl,
      ogSiteName: seoData.ogSiteName,
      twitterCard: seoData.twitterCard,
      twitterTitle: seoData.twitterTitle,
      twitterDescription: seoData.twitterDescription,
      twitterImage: seoData.twitterImage,
      twitterSite: seoData.twitterSite,
      twitterCreator: seoData.twitterCreator,
      robots: seoData.robots,
      author: seoData.author,
      viewport: seoData.viewport,
      language: seoData.language
    };
  }

  async getStructuredData(url: string): Promise<any> {
    const seoData = await this.pageSeoModel.findOne({ url, isActive: true }).exec();
    
    if (!seoData || !seoData.structuredData) {
      return this.generateDefaultStructuredData(url);
    }

    return seoData.structuredData;
  }

  private buildMetaTags(seoData: PageSeoDocument): string {
    const tags = [];

    // Basic Meta Tags
    tags.push(`<title>${this.escapeHtml(seoData.pageTitle)}</title>`);
    tags.push(`<meta name="title" content="${this.escapeHtml(seoData.metaTitle)}" />`);
    tags.push(`<meta name="description" content="${this.escapeHtml(seoData.metaDescription)}" />`);
    
    if (seoData.metaKeywords && seoData.metaKeywords.length > 0) {
      tags.push(`<meta name="keywords" content="${seoData.metaKeywords.map(k => this.escapeHtml(k)).join(', ')}" />`);
    }

    if (seoData.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${this.escapeHtml(seoData.canonicalUrl)}" />`);
    }

    if (seoData.robots) {
      tags.push(`<meta name="robots" content="${this.escapeHtml(seoData.robots)}" />`);
    }

    if (seoData.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(seoData.author)}" />`);
    }

    if (seoData.viewport) {
      tags.push(`<meta name="viewport" content="${this.escapeHtml(seoData.viewport)}" />`);
    }

    if (seoData.language) {
      tags.push(`<meta http-equiv="Content-Language" content="${this.escapeHtml(seoData.language)}" />`);
    }

    // Open Graph Tags
    if (seoData.ogTitle) {
      tags.push(`<meta property="og:title" content="${this.escapeHtml(seoData.ogTitle)}" />`);
    }

    if (seoData.ogDescription) {
      tags.push(`<meta property="og:description" content="${this.escapeHtml(seoData.ogDescription)}" />`);
    }

    if (seoData.ogImage) {
      tags.push(`<meta property="og:image" content="${this.escapeHtml(seoData.ogImage)}" />`);
    }

    if (seoData.ogType) {
      tags.push(`<meta property="og:type" content="${this.escapeHtml(seoData.ogType)}" />`);
    }

    if (seoData.ogUrl) {
      tags.push(`<meta property="og:url" content="${this.escapeHtml(seoData.ogUrl)}" />`);
    }

    if (seoData.ogSiteName) {
      tags.push(`<meta property="og:site_name" content="${this.escapeHtml(seoData.ogSiteName)}" />`);
    }

    // Twitter Cards
    if (seoData.twitterCard) {
      tags.push(`<meta name="twitter:card" content="${this.escapeHtml(seoData.twitterCard)}" />`);
    }

    if (seoData.twitterTitle) {
      tags.push(`<meta name="twitter:title" content="${this.escapeHtml(seoData.twitterTitle)}" />`);
    }

    if (seoData.twitterDescription) {
      tags.push(`<meta name="twitter:description" content="${this.escapeHtml(seoData.twitterDescription)}" />`);
    }

    if (seoData.twitterImage) {
      tags.push(`<meta name="twitter:image" content="${this.escapeHtml(seoData.twitterImage)}" />`);
    }

    if (seoData.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${this.escapeHtml(seoData.twitterSite)}" />`);
    }

    if (seoData.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${this.escapeHtml(seoData.twitterCreator)}" />`);
    }

    return tags.join('\n');
  }

  private generateDefaultMetaTags(url: string): string {
    const baseUrl = process.env.FRONTEND_URL || 'https://dongwoo-sky.com';
    const siteName = '동우스카이';
    
    return `<title>${siteName} - 전문 드론 촬영 서비스</title>
<meta name="title" content="${siteName} - 전문 드론 촬영 서비스" />
<meta name="description" content="전문 드론 촬영 서비스 ${siteName}입니다. 건축, 부동산, 이벤트, 광고 촬영 전문." />
<meta name="keywords" content="드론촬영, 항공촬영, 건축촬영, 부동산촬영, 이벤트촬영, ${siteName}" />
<meta name="robots" content="index, follow" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Language" content="ko-KR" />
<meta property="og:title" content="${siteName} - 전문 드론 촬영 서비스" />
<meta property="og:description" content="전문 드론 촬영 서비스 ${siteName}입니다. 건축, 부동산, 이벤트, 광고 촬영 전문." />
<meta property="og:type" content="website" />
<meta property="og:url" content="${baseUrl}${url}" />
<meta property="og:site_name" content="${siteName}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${siteName} - 전문 드론 촬영 서비스" />
<meta name="twitter:description" content="전문 드론 촬영 서비스 ${siteName}입니다. 건축, 부동산, 이벤트, 광고 촬영 전문." />`;
  }

  private generateDefaultStructuredData(url: string): any {
    const baseUrl = process.env.FRONTEND_URL || 'https://dongwoo-sky.com';
    
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "동우스카이",
      "url": `${baseUrl}${url}`,
      "description": "전문 드론 촬영 서비스",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+82-10-0000-0000",
        "email": "contact@dongwoo-sky.com"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KR",
        "addressLocality": "서울특별시"
      },
      "sameAs": [
        "https://www.facebook.com/dongwoo-sky",
        "https://www.instagram.com/dongwoo-sky"
      ]
    };
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}