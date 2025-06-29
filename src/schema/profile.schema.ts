import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true, collection: 'profiles' })
export class Profile {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  introduction: string;

  @Prop({ type: [String], required: true })
  careers: string[];

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop()
  profileImage?: string; // 프로필 이미지 URL

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
