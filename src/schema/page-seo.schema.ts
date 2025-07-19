import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PageSeoDocument = PageSeo & Document;

@Schema({ timestamps: true })
export class PageSeo {
  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ required: true })
  pageTitle: string;

  @Prop({ required: true })
  metaTitle: string;

  @Prop({ required: true })
  metaDescription: string;

  @Prop({ type: [String], default: [] })
  metaKeywords: string[];

  @Prop()
  canonicalUrl: string;

  // Open Graph 메타데이터
  @Prop()
  ogTitle: string;

  @Prop()
  ogDescription: string;

  @Prop()
  ogImage: string;

  @Prop({ default: 'website' })
  ogType: string;

  @Prop()
  ogUrl: string;

  @Prop()
  ogSiteName: string;

  // Twitter Cards 메타데이터
  @Prop({ default: 'summary_large_image' })
  twitterCard: string;

  @Prop()
  twitterTitle: string;

  @Prop()
  twitterDescription: string;

  @Prop()
  twitterImage: string;

  @Prop()
  twitterSite: string;

  @Prop()
  twitterCreator: string;

  // 구조화된 데이터 (Schema.org)
  @Prop({ type: Object })
  structuredData: Record<string, any>;

  // 추가 메타태그
  @Prop()
  robots: string;

  @Prop()
  author: string;

  @Prop()
  viewport: string;

  @Prop()
  language: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastModified: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PageSeoSchema = SchemaFactory.createForClass(PageSeo);