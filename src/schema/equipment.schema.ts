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

  @Prop([String])
  capabilities?: string[];

  @Prop()
  iconUrl?: string;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: false })
  showInService: boolean;

  @Prop({ default: false })
  showInPricing: boolean;

  @Prop({ type: [String], default: [] })
  priceRanges?: string[];

  @Prop({ type: Number })
  basePrice?: number;

  @Prop({ type: Number })
  hourlyRate?: number;

  @Prop({ type: Number, default: 4 })
  baseHours?: number;

  @Prop({ type: Number, default: 1 })
  minHours?: number;

  @Prop({ type: Number, default: 12 })
  maxHours?: number;

  @Prop({ type: [String], default: [] })
  workingTimeRanges?: string[];
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
