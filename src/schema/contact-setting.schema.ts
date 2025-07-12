import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactSettingDocument = ContactSetting & Document;

@Schema({
  timestamps: true,
  collection: 'contact_settings',
})
export class ContactSetting {
  @Prop({ required: true })
  pageTitle: string;

  @Prop({ required: true })
  pageSubtitle: string;

  @Prop({ required: true })
  pageDescription: string;

  @Prop({ required: true })
  contactSectionTitle: string;

  @Prop({ required: true })
  contactSectionDescription: string;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  businessAddress: string;

  @Prop({ required: true })
  businessPhone: string;

  @Prop({ required: true })
  businessEmail: string;

  @Prop()
  businessFax?: string;

  @Prop({ required: true })
  operatingHours: string;

  @Prop({ type: [String], default: [] })
  businessDays: string[];

  @Prop()
  kakaoTalkId?: string;

  @Prop()
  naverTalkId?: string;

  @Prop()
  instagramUrl?: string;

  @Prop()
  facebookUrl?: string;

  @Prop()
  youtubeUrl?: string;

  @Prop({ required: true })
  formTitle: string;

  @Prop({ required: true })
  formDescription: string;

  @Prop({ type: [String], default: [] })
  inquiryTypes: string[];

  @Prop({ required: true })
  submitButtonText: string;

  @Prop({ required: true })
  successMessage: string;

  @Prop({ required: true })
  errorMessage: string;

  @Prop({ type: [String], default: [] })
  privacyNotes: string[];

  @Prop({ required: true })
  emergencyContactTitle: string;

  @Prop({ required: true })
  emergencyContactDescription: string;

  @Prop({ required: true })
  emergencyPhone: string;

  @Prop()
  emergencyHours?: string;

  @Prop()
  mapTitle?: string;

  @Prop()
  mapDescription?: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  @Prop()
  mapApiKey?: string;

  // Discord 웹훅 설정
  @Prop({ default: '' })
  discordWebhookUrl: string;

  @Prop({ default: true })
  discordEnabled: boolean;

  @Prop({ default: '새로운 문의가 도착했습니다' })
  discordMessageTitle: string;

  @Prop({ default: '#00ff00' })
  discordEmbedColor: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ContactSettingSchema = SchemaFactory.createForClass(ContactSetting);