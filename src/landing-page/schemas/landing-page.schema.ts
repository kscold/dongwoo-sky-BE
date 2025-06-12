import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandingPageDocument = LandingPage & Document;

// 히어로 섹션 스키마
@Schema({ _id: false })
export class HeroSection {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  backgroundImageUrl: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  ctaText: string;

  @Prop({ required: true })
  ctaLink: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const HeroSectionSchema = SchemaFactory.createForClass(HeroSection);

@Schema({
  timestamps: true,
  collection: 'landingPages',
})
export class LandingPage {
  @Prop({ required: true })
  title: string;

  @Prop({ type: HeroSectionSchema, required: true })
  heroSection: HeroSection;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const LandingPageSchema = SchemaFactory.createForClass(LandingPage);
