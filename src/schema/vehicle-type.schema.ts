import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class VehicleType extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: 'ladder' | 'sky'; // 일반 사다리차 vs 스카이 사다리차

  @Prop()
  iconUrl?: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop([String])
  priceRanges: string[]; // 가격대 정보

  @Prop()
  specifications?: string; // 사양 정보
}

export const VehicleTypeSchema = SchemaFactory.createForClass(VehicleType);
