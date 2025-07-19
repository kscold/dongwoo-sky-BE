import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SitemapConfig, SitemapConfigDocument } from '../../schema/sitemap-config.schema';
import { CreateSitemapConfigDto } from './dto/request/create-sitemap-config.dto';
import { UpdateSitemapConfigDto } from './dto/request/update-sitemap-config.dto';
import { SitemapConfigResponseDto } from './dto/response/sitemap-config-response.dto';

@Injectable()
export class AdminSitemapService {
  constructor(
    @InjectModel(SitemapConfig.name) private sitemapConfigModel: Model<SitemapConfigDocument>
  ) {}

  async getAllSitemapConfigs(
    page: number = 1,
    limit: number = 50,
    search?: string,
    category?: string,
    type?: 'static' | 'dynamic',
    isActive?: boolean
  ): Promise<{
    configs: SitemapConfigResponseDto[];
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
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const [configs, total] = await Promise.all([
      this.sitemapConfigModel
        .find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.sitemapConfigModel.countDocuments(query).exec()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      configs: configs.map(config => this.transformToResponseDto(config)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async getSitemapConfig(id: string): Promise<SitemapConfigResponseDto> {
    const config = await this.sitemapConfigModel.findById(id).exec();
    if (!config) {
      throw new NotFoundException(`Sitemap config with ID ${id} not found`);
    }
    return this.transformToResponseDto(config);
  }

  async createSitemapConfig(createDto: CreateSitemapConfigDto): Promise<SitemapConfigResponseDto> {
    const existingConfig = await this.sitemapConfigModel.findOne({ url: createDto.url }).exec();
    if (existingConfig) {
      throw new ConflictException(`Sitemap config with URL ${createDto.url} already exists`);
    }

    const config = new this.sitemapConfigModel({
      ...createDto,
      lastModified: new Date()
    });

    const savedConfig = await config.save();
    return this.transformToResponseDto(savedConfig);
  }

  async updateSitemapConfig(id: string, updateDto: UpdateSitemapConfigDto): Promise<SitemapConfigResponseDto> {
    if (updateDto.url) {
      const existingConfig = await this.sitemapConfigModel
        .findOne({ url: updateDto.url, _id: { $ne: id } })
        .exec();
      if (existingConfig) {
        throw new ConflictException(`Sitemap config with URL ${updateDto.url} already exists`);
      }
    }

    const config = await this.sitemapConfigModel
      .findByIdAndUpdate(
        id,
        { ...updateDto, lastModified: new Date() },
        { new: true }
      )
      .exec();

    if (!config) {
      throw new NotFoundException(`Sitemap config with ID ${id} not found`);
    }

    return this.transformToResponseDto(config);
  }

  async deleteSitemapConfig(id: string): Promise<void> {
    const result = await this.sitemapConfigModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Sitemap config with ID ${id} not found`);
    }
  }

  async generateSitemap(): Promise<string> {
    const configs = await this.sitemapConfigModel
      .find({ isActive: true, includeInSitemap: true })
      .sort({ sortOrder: 1 })
      .exec();

    const sitemapXml = this.buildSitemapXml(configs);
    
    // TODO: S3에 sitemap.xml 업로드 구현
    const sitemapUrl = `${process.env.FRONTEND_URL}/sitemap.xml`;
    
    return sitemapUrl;
  }

  async generateSitemapXml(): Promise<string> {
    const configs = await this.sitemapConfigModel
      .find({ isActive: true, includeInSitemap: true })
      .sort({ sortOrder: 1 })
      .exec();

    return this.buildSitemapXml(configs);
  }

  async initializeDefaultSitemapConfigs(): Promise<number> {
    const defaultConfigs = [
      {
        url: '/',
        type: 'static' as const,
        priority: 1.0,
        changefreq: 'weekly' as const,
        description: '홈페이지',
        category: 'main',
        sortOrder: 1
      },
      {
        url: '/about',
        type: 'static' as const,
        priority: 0.8,
        changefreq: 'monthly' as const,
        description: '회사 소개',
        category: 'about',
        sortOrder: 2
      },
      {
        url: '/services',
        type: 'static' as const,
        priority: 0.9,
        changefreq: 'weekly' as const,
        description: '서비스 안내',
        category: 'service',
        sortOrder: 3
      },
      {
        url: '/pricing',
        type: 'static' as const,
        priority: 0.9,
        changefreq: 'weekly' as const,
        description: '가격 안내',
        category: 'pricing',
        sortOrder: 4
      },
      {
        url: '/contact',
        type: 'static' as const,
        priority: 0.7,
        changefreq: 'monthly' as const,
        description: '문의하기',
        category: 'contact',
        sortOrder: 5
      }
    ];

    const existingUrls = await this.sitemapConfigModel
      .find({ url: { $in: defaultConfigs.map(config => config.url) } })
      .select('url')
      .exec();

    const existingUrlSet = new Set(existingUrls.map(config => config.url));
    const newConfigs = defaultConfigs.filter(config => !existingUrlSet.has(config.url));

    if (newConfigs.length > 0) {
      await this.sitemapConfigModel.insertMany(
        newConfigs.map(config => ({
          ...config,
          lastModified: new Date()
        }))
      );
    }

    return newConfigs.length;
  }

  private buildSitemapXml(configs: SitemapConfigDocument[]): string {
    const baseUrl = process.env.FRONTEND_URL || 'https://dongwoo-sky.com';
    
    const urls = configs.map(config => {
      const fullUrl = config.url.startsWith('http') ? config.url : `${baseUrl}${config.url}`;
      const lastMod = config.lastModified ? config.lastModified.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      return `  <url>
    <loc>${fullUrl}</loc>
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

  private transformToResponseDto(config: SitemapConfigDocument): SitemapConfigResponseDto {
    return {
      id: config._id.toString(),
      url: config.url,
      type: config.type,
      priority: config.priority,
      changefreq: config.changefreq,
      isActive: config.isActive,
      lastModified: config.lastModified,
      description: config.description,
      category: config.category,
      sortOrder: config.sortOrder,
      includeInSitemap: config.includeInSitemap,
      allowRobots: config.allowRobots,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    };
  }
}