import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentSettingsDocument = ContentSettings & Document;

@Schema({ timestamps: true })
export class ContentSettings {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  value: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ContentSettingsSchema = SchemaFactory.createForClass(ContentSettings);
