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
  imageUrl?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  specifications?: string;

  @Prop()
  priceRange?: string;

  @Prop()
  tonnage?: string;

  @Prop()
  maxHeight?: string;

  @Prop()
  maxWeight?: string;

  @Prop()
  iconUrl?: string;

  @Prop([String])
  priceRanges?: string[];

  // 서비스별 노출 여부
  @Prop({ default: false })
  showInService: boolean;

  @Prop({ default: false })
  showInPricing: boolean;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
