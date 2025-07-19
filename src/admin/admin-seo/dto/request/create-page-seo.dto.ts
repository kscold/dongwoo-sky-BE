import { IsString, IsOptional, IsArray, IsBoolean, IsUrl, IsObject } from 'class-validator';

export class CreatePageSeoDto {
  @IsString()
  @IsUrl({}, { message: 'URL 형식이 올바르지 않습니다.' })
  url: string;

  @IsString()
  pageTitle: string;

  @IsString()
  metaTitle: string;

  @IsString()
  metaDescription: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Canonical URL 형식이 올바르지 않습니다.' })
  canonicalUrl?: string;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'OG Image URL 형식이 올바르지 않습니다.' })
  ogImage?: string;

  @IsOptional()
  @IsString()
  ogType?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'OG URL 형식이 올바르지 않습니다.' })
  ogUrl?: string;

  @IsOptional()
  @IsString()
  ogSiteName?: string;

  @IsOptional()
  @IsString()
  twitterCard?: string;

  @IsOptional()
  @IsString()
  twitterTitle?: string;

  @IsOptional()
  @IsString()
  twitterDescription?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Twitter Image URL 형식이 올바르지 않습니다.' })
  twitterImage?: string;

  @IsOptional()
  @IsString()
  twitterSite?: string;

  @IsOptional()
  @IsString()
  twitterCreator?: string;

  @IsOptional()
  @IsObject()
  structuredData?: Record<string, any>;

  @IsOptional()
  @IsString()
  robots?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  viewport?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive는 boolean 값이어야 합니다.' })
  isActive?: boolean;
}