import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true, collection: 'services' })
export class Service {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  icon?: string; // 아이콘 이미지 URL (선택사항)

  // SEO 메타 태그 세팅
  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop()
  metaKeywords?: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
