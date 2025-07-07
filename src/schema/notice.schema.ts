import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Attachment {
  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  fileName: string;
}
const AttachmentSchema = SchemaFactory.createForClass(Attachment);

export type NoticeDocument = Notice & Document;

@Schema({
  timestamps: true, // createdAt, updatedAt 자동 추가
  versionKey: false, // __v 필드 제거
  collection: 'notices',
})
export class Notice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: false })
  isModal: boolean;

  @Prop({ type: Date, required: false })
  modalEndDate?: Date;

  @Prop({ required: false, default: '관리자' })
  author?: string;

  @Prop({ type: [String], required: false, default: [] })
  tags?: string[];

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ type: [AttachmentSchema], default: [] })
  attachments: Attachment[];
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
