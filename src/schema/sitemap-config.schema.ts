import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SitemapConfigDocument = SitemapConfig & Document;

@Schema({ timestamps: true })
export class SitemapConfig {
  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ required: true, enum: ['static', 'dynamic'] })
  type: 'static' | 'dynamic';

  @Prop({ required: true, min: 0.0, max: 1.0, default: 0.5 })
  priority: number;

  @Prop({ 
    required: true, 
    enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
    default: 'weekly'
  })
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastModified: Date;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  includeInSitemap: boolean;

  @Prop({ default: true })
  allowRobots: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SitemapConfigSchema = SchemaFactory.createForClass(SitemapConfig);