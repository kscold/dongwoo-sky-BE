import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EquipmentDocument = Equipment & Document;

@Schema({ timestamps: true, collection: 'equipments' })
export class Equipment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  specifications: string; // 상세 사양

  @Prop([String])
  capabilities: string[]; // 작업 가능 범위

  @Prop()
  priceRange: string; // 가격 범위

  @Prop()
  maxHeight: string; // 최대 높이 (스카이차)

  @Prop()
  maxWeight: string; // 최대 중량 (크레인)

  @Prop()
  tonnage: string; // 톤수
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
