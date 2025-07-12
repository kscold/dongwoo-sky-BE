import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactInquiryDocument = ContactInquiry & Document;

@Schema({
  timestamps: true,
  collection: 'contact_inquiries',
})
export class ContactInquiry {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  company?: string;

  @Prop({ required: true })
  inquiryType: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  privacyAgreed: boolean;

  @Prop({ default: false })
  marketingAgreed: boolean;

  @Prop({ default: 'pending', enum: ['pending', 'in_progress', 'resolved', 'closed'] })
  status: string;

  @Prop()
  adminNote?: string;

  @Prop()
  respondedAt?: Date;

  @Prop()
  respondedBy?: string;

  @Prop({ default: false })
  isUrgent: boolean;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ContactInquirySchema = SchemaFactory.createForClass(ContactInquiry);