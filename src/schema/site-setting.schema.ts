import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingDocument = SiteSetting & Document;

@Schema({ timestamps: true, collection: 'site_settings' })
export class SiteSetting {
  @Prop({ default: 'global_settings', unique: true })
  identifier: string;

  @Prop()
  contactPhoneNumber?: string;

  @Prop()
  kakaoOpenChatUrl?: string;
}

export const SiteSettingSchema = SchemaFactory.createForClass(SiteSetting);
