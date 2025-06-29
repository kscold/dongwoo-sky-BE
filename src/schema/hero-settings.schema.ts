import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroSettingsDocument = HeroSettings & Document;

// 히어로 이미지 인터페이스
export interface HeroImage {
  url: string;
  key: string;
  name: string;
  order: number;
  isActive: boolean;
}

@Schema({ timestamps: true })
export class HeroSettings {
  @Prop({ required: true, default: 'main' })
  key: string; // 'main'으로 고정하여 단일 히어로 섹션 관리

  @Prop({ required: true, default: '어울림 스카이' })
  title: string;

  @Prop({
    required: true,
    default: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
  })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: '무료 견적 문의' })
  ctaText: string;

  @Prop({ required: true, default: '/contact' })
  ctaLink: string;

  // 단일 이미지 URL (하위 호환성을 위해 유지)
  @Prop({ default: '' })
  backgroundImageUrl: string;

  // 여러 이미지 배열 (최대 10개)
  @Prop({
    type: [
      {
        url: { type: String, required: true },
        key: { type: String, required: true },
        name: { type: String, required: true },
        order: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, default: true },
      },
    ],
    default: [],
    validate: {
      validator: function (images: HeroImage[]) {
        return images.length <= 10;
      },
      message: '히어로 이미지는 최대 10개까지 등록할 수 있습니다.',
    },
  })
  backgroundImages: HeroImage[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HeroSettingsSchema = SchemaFactory.createForClass(HeroSettings);
