import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerReviewDocument = CustomerReview & Document;

@Schema({
  timestamps: true,
  collection: 'customer_reviews',
})
export class CustomerReview {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string; // Rich text editor content

  @Prop({ type: [String], default: [] })
  imageUrls: string[]; // 최대 10개 이미지 배열

  @Prop({ required: true, trim: true })
  customerName: string; // 고객 이름

  @Prop({ trim: true })
  customerCompany?: string; // 고객 회사명

  @Prop({ trim: true })
  projectLocation?: string; // 작업 위치

  @Prop({ trim: true })
  serviceType?: string; // 이용한 서비스 타입

  @Prop({ min: 1, max: 5, required: true })
  rating: number; // 5점 만점 평점

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  helpfulCount: number; // 도움됨 카운트

  @Prop({ default: Date.now })
  publishedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomerReviewSchema =
  SchemaFactory.createForClass(CustomerReview);

// 인덱스 추가
CustomerReviewSchema.index({ publishedAt: -1 });
CustomerReviewSchema.index({ isActive: 1, publishedAt: -1 });
CustomerReviewSchema.index({ rating: -1 });
CustomerReviewSchema.index({ customerName: 1 });
