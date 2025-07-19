import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageSeo, PageSeoDocument } from '../../schema/page-seo.schema';
import { CreatePageSeoDto } from './dto/request/create-page-seo.dto';
import { UpdatePageSeoDto } from './dto/request/update-page-seo.dto';
import { PageSeoResponseDto } from './dto/response/page-seo-response.dto';

@Injectable()
export class AdminSeoService {
  constructor(
    @InjectModel(PageSeo.name) private pageSeoModel: Model<PageSeoDocument>
  ) {}

  async getAllPageSeo(
    page: number = 1,
    limit: number = 50,
    search?: string,
    isActive?: boolean
  ): Promise<{
    seoData: PageSeoResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { url: { $regex: search, $options: 'i' } },
        { pageTitle: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { metaDescription: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const [seoData, total] = await Promise.all([
      this.pageSeoModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.pageSeoModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      seoData: seoData.map(data => this.transformToResponseDto(data)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async getPageSeo(id: string): Promise<PageSeoResponseDto> {
    const seoData = await this.pageSeoModel.findById(id).exec();
    if (!seoData) {
      throw new NotFoundException(`SEO data with ID ${id} not found`);
    }
    return this.transformToResponseDto(seoData);
  }

  async getPageSeoByUrl(url: string): Promise<PageSeoResponseDto> {
    const seoData = await this.pageSeoModel.findOne({ url }).exec();
    if (!seoData) {
      throw new NotFoundException(`SEO data for URL ${url} not found`);
    }
    return this.transformToResponseDto(seoData);
  }

  async createPageSeo(createDto: CreatePageSeoDto): Promise<PageSeoResponseDto> {
    const existingSeo = await this.pageSeoModel.findOne({ url: createDto.url }).exec();
    if (existingSeo) {
      throw new ConflictException(`SEO data for URL ${createDto.url} already exists`);
    }

    const seoData = new this.pageSeoModel({
      ...createDto,
      lastModified: new Date()
    });

    const savedSeo = await seoData.save();
    return this.transformToResponseDto(savedSeo);
  }

  async updatePageSeo(id: string, updateDto: UpdatePageSeoDto): Promise<PageSeoResponseDto> {
    if (updateDto.url) {
      const existingSeo = await this.pageSeoModel
        .findOne({ url: updateDto.url, _id: { $ne: id } })
        .exec();
      if (existingSeo) {
        throw new ConflictException(`SEO data for URL ${updateDto.url} already exists`);
      }
    }

    const seoData = await this.pageSeoModel
      .findByIdAndUpdate(
        id,
        { ...updateDto, lastModified: new Date() },
        { new: true }
      )
      .exec();

    if (!seoData) {
      throw new NotFoundException(`SEO data with ID ${id} not found`);
    }

    return this.transformToResponseDto(seoData);
  }

  async deletePageSeo(id: string): Promise<void> {
    const result = await this.pageSeoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`SEO data with ID ${id} not found`);
    }
  }

  async initializeDefaultPageSeo(): Promise<number> {
    const defaultSeoData = [
      {
        url: '/',
        pageTitle: '동우스카이 - 전문 드론 촬영 서비스',
        metaTitle: '동우스카이 - 전문 드론 촬영 서비스 | 건축, 부동산, 이벤트 촬영',
        metaDescription: '전문 드론 촬영 서비스 동우스카이입니다. 건축, 부동산, 이벤트, 광고 촬영 전문. 최고 품질의 드론 촬영으로 특별한 순간을 기록하세요.',
        metaKeywords: ['드론촬영', '항공촬영', '건축촬영', '부동산촬영', '이벤트촬영', '동우스카이'],
        ogTitle: '동우스카이 - 전문 드론 촬영 서비스',
        ogDescription: '전문 드론 촬영 서비스 동우스카이입니다. 건축, 부동산, 이벤트, 광고 촬영 전문.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        language: 'ko-KR',
        viewport: 'width=device-width, initial-scale=1.0'
      },
      {
        url: '/about',
        pageTitle: '회사 소개 - 동우스카이',
        metaTitle: '회사 소개 - 동우스카이 | 전문 드론 촬영 서비스',
        metaDescription: '동우스카이는 전문 드론 촬영 서비스를 제공하는 회사입니다. 풍부한 경험과 최신 장비로 최고의 촬영 서비스를 제공합니다.',
        metaKeywords: ['동우스카이', '회사소개', '드론촬영', '전문업체', '촬영서비스'],
        ogTitle: '회사 소개 - 동우스카이',
        ogDescription: '동우스카이는 전문 드론 촬영 서비스를 제공하는 회사입니다.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        language: 'ko-KR',
        viewport: 'width=device-width, initial-scale=1.0'
      },
      {
        url: '/services',
        pageTitle: '서비스 안내 - 동우스카이',
        metaTitle: '서비스 안내 - 동우스카이 | 드론 촬영 서비스',
        metaDescription: '건축, 부동산, 이벤트, 광고 촬영 등 다양한 드론 촬영 서비스를 제공합니다. 전문 장비와 숙련된 조종사가 최고의 결과물을 제공합니다.',
        metaKeywords: ['드론촬영서비스', '건축촬영', '부동산촬영', '이벤트촬영', '광고촬영'],
        ogTitle: '서비스 안내 - 동우스카이',
        ogDescription: '건축, 부동산, 이벤트, 광고 촬영 등 다양한 드론 촬영 서비스를 제공합니다.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        language: 'ko-KR',
        viewport: 'width=device-width, initial-scale=1.0'
      },
      {
        url: '/pricing',
        pageTitle: '가격 안내 - 동우스카이',
        metaTitle: '가격 안내 - 동우스카이 | 드론 촬영 비용',
        metaDescription: '드론 촬영 서비스 가격 안내입니다. 투명하고 합리적인 가격으로 최고의 드론 촬영 서비스를 제공합니다.',
        metaKeywords: ['드론촬영가격', '촬영비용', '가격안내', '견적', '동우스카이'],
        ogTitle: '가격 안내 - 동우스카이',
        ogDescription: '드론 촬영 서비스 가격 안내입니다. 투명하고 합리적인 가격으로 최고의 드론 촬영 서비스를 제공합니다.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        language: 'ko-KR',
        viewport: 'width=device-width, initial-scale=1.0'
      },
      {
        url: '/contact',
        pageTitle: '문의하기 - 동우스카이',
        metaTitle: '문의하기 - 동우스카이 | 드론 촬영 문의',
        metaDescription: '드론 촬영 서비스 문의 및 예약 안내입니다. 언제든지 연락주시면 친절히 상담해드리겠습니다.',
        metaKeywords: ['드론촬영문의', '촬영예약', '상담', '연락처', '동우스카이'],
        ogTitle: '문의하기 - 동우스카이',
        ogDescription: '드론 촬영 서비스 문의 및 예약 안내입니다. 언제든지 연락주시면 친절히 상담해드리겠습니다.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        language: 'ko-KR',
        viewport: 'width=device-width, initial-scale=1.0'
      }
    ];

    const existingUrls = await this.pageSeoModel
      .find({ url: { $in: defaultSeoData.map(data => data.url) } })
      .select('url')
      .exec();

    const existingUrlSet = new Set(existingUrls.map(data => data.url));
    const newSeoData = defaultSeoData.filter(data => !existingUrlSet.has(data.url));

    if (newSeoData.length > 0) {
      await this.pageSeoModel.insertMany(
        newSeoData.map(data => ({
          ...data,
          lastModified: new Date()
        }))
      );
    }

    return newSeoData.length;
  }

  async generateMetaTags(id: string): Promise<string> {
    const seoData = await this.pageSeoModel.findById(id).exec();
    if (!seoData) {
      throw new NotFoundException(`SEO data with ID ${id} not found`);
    }

    return this.buildMetaTags(seoData);
  }

  private buildMetaTags(seoData: PageSeoDocument): string {
    const tags = [];

    // Basic Meta Tags
    tags.push(`<title>${seoData.pageTitle}</title>`);
    tags.push(`<meta name="title" content="${seoData.metaTitle}" />`);
    tags.push(`<meta name="description" content="${seoData.metaDescription}" />`);
    
    if (seoData.metaKeywords && seoData.metaKeywords.length > 0) {
      tags.push(`<meta name="keywords" content="${seoData.metaKeywords.join(', ')}" />`);
    }

    if (seoData.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${seoData.canonicalUrl}" />`);
    }

    if (seoData.robots) {
      tags.push(`<meta name="robots" content="${seoData.robots}" />`);
    }

    if (seoData.author) {
      tags.push(`<meta name="author" content="${seoData.author}" />`);
    }

    if (seoData.viewport) {
      tags.push(`<meta name="viewport" content="${seoData.viewport}" />`);
    }

    if (seoData.language) {
      tags.push(`<meta http-equiv="Content-Language" content="${seoData.language}" />`);
    }

    // Open Graph Tags
    if (seoData.ogTitle) {
      tags.push(`<meta property="og:title" content="${seoData.ogTitle}" />`);
    }

    if (seoData.ogDescription) {
      tags.push(`<meta property="og:description" content="${seoData.ogDescription}" />`);
    }

    if (seoData.ogImage) {
      tags.push(`<meta property="og:image" content="${seoData.ogImage}" />`);
    }

    if (seoData.ogType) {
      tags.push(`<meta property="og:type" content="${seoData.ogType}" />`);
    }

    if (seoData.ogUrl) {
      tags.push(`<meta property="og:url" content="${seoData.ogUrl}" />`);
    }

    if (seoData.ogSiteName) {
      tags.push(`<meta property="og:site_name" content="${seoData.ogSiteName}" />`);
    }

    // Twitter Cards
    if (seoData.twitterCard) {
      tags.push(`<meta name="twitter:card" content="${seoData.twitterCard}" />`);
    }

    if (seoData.twitterTitle) {
      tags.push(`<meta name="twitter:title" content="${seoData.twitterTitle}" />`);
    }

    if (seoData.twitterDescription) {
      tags.push(`<meta name="twitter:description" content="${seoData.twitterDescription}" />`);
    }

    if (seoData.twitterImage) {
      tags.push(`<meta name="twitter:image" content="${seoData.twitterImage}" />`);
    }

    if (seoData.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${seoData.twitterSite}" />`);
    }

    if (seoData.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${seoData.twitterCreator}" />`);
    }

    // Structured Data
    if (seoData.structuredData) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(seoData.structuredData, null, 2)}</script>`);
    }

    return tags.join('\n');
  }

  private transformToResponseDto(seoData: PageSeoDocument): PageSeoResponseDto {
    return {
      id: seoData._id.toString(),
      url: seoData.url,
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
      structuredData: seoData.structuredData,
      robots: seoData.robots,
      author: seoData.author,
      viewport: seoData.viewport,
      language: seoData.language,
      isActive: seoData.isActive,
      lastModified: seoData.lastModified,
      createdAt: seoData.createdAt,
      updatedAt: seoData.updatedAt
    };
  }
}