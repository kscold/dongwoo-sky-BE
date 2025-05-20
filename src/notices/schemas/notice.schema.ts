import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({
  timestamps: true, // createdAt, updatedAt 자동 추가
  versionKey: false, // __v 필드 제거
})
export class Notice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: Date })
  publishedAt: Date;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
