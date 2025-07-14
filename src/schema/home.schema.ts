import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ImageInfo } from '../common/dto/file.dto';

// HeroImage는 ImageInfo 타입으로 대체
type HeroImage = ImageInfo;

// Re-export HeroImage for backward compatibility
export type { HeroImage };

@Schema({ _id: false })
export class HeroButton {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  link: string;
}

const HeroButtonSchema = SchemaFactory.createForClass(HeroButton);

@Schema({ _id: false })
export class HeroSection {
  @Prop({ required: true, default: '어울림 스카이' })
  title: string;

  @Prop({ required: true, default: '어울림 스카이' })
  companyName: string;

  @Prop({ required: true, default: '어울림 스카이' })
  highlightText: string;

  @Prop({
    required: true,
    default: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
  })
  subtitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [HeroButtonSchema], default: [] })
  ctaButtons: HeroButton[];

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
  })
  backgroundImageUrls: HeroImage[];

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({ _id: false })
export class HomeContentSetting {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type HomeDocument = Home & Document;

@Schema({ timestamps: true, collection: 'homes' })
export class Home {
  @Prop({ required: true, unique: true, default: 'main' })
  key: string;

  @Prop({ required: true, default: '홈 설정' })
  title: string;

  @Prop({ required: true, default: '홈페이지에 대한 설명입니다.' })
  description: string;

  @Prop({ type: HeroSection, required: true })
  heroSection: HeroSection;

  @Prop({ type: [HomeContentSetting], default: [] })
  contentSettings: HomeContentSetting[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HomeSchema = SchemaFactory.createForClass(Home);
