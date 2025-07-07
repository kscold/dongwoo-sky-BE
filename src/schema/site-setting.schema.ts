import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingDocument = SiteSetting & Document;

@Schema({ timestamps: true, collection: 'site_settings' })
export class SiteSetting {
  @Prop({ default: 'global_settings', unique: true })
  key: string;

  @Prop()
  contactPhoneNumber?: string;

  @Prop()
  kakaoOpenChatUrl?: string;

  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop()
  metaKeywords?: string;

  @Prop()
  companyName?: string;

  @Prop()
  businessRegistrationNumber?: string;

  @Prop()
  address?: string;
}

export const SiteSettingSchema = SchemaFactory.createForClass(SiteSetting);
