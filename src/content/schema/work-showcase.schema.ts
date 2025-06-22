import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkShowcaseDocument = WorkShowcase & Document;

@Schema({
  timestamps: true,
  collection: 'work_showcases',
})
export class WorkShowcase {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string; // Rich text editor content

  @Prop({ type: [String], default: [] })
  imageUrls: string[]; // 최대 10개 이미지 배열

  @Prop({ required: true, trim: true })
  authorName: string; // 작업자 이름

  @Prop({ trim: true })
  authorRole?: string; // 작업자 역할/직책

  @Prop({ trim: true })
  projectLocation?: string; // 작업 위치

  @Prop({ trim: true })
  equipmentUsed?: string; // 사용된 장비

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: Date.now })
  publishedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const WorkShowcaseSchema = SchemaFactory.createForClass(WorkShowcase);

// 인덱스 추가
WorkShowcaseSchema.index({ publishedAt: -1 });
WorkShowcaseSchema.index({ isActive: 1, publishedAt: -1 });
WorkShowcaseSchema.index({ authorName: 1 });
