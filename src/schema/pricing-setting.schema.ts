import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PricingSettingDocument = PricingSetting & Document;

@Schema({ timestamps: true, collection: 'pricing_settings' })
export class PricingSetting {
    @Prop({ required: true })
    mainTitle: string;

    @Prop({ required: true })
    mainSubtitle: string;

    @Prop({ required: true })
    discountBannerTitle: string;

    @Prop({ required: true })
    discountBannerSubtitle: string;

    @Prop({ type: Number, required: true, min: 0, max: 100 })
    discountPercentage: number;

    @Prop({ required: true })
    equipmentSectionTitle: string;

    @Prop({ required: true })
    equipmentSectionDescription: string;

    @Prop({ required: true })
    timeSectionTitle: string;

    @Prop({ required: true })
    timeSectionDescription: string;

    @Prop({ required: true })
    priceCardTitle: string;

    @Prop({ required: true })
    onlinePriceLabel: string;

    @Prop({ required: true })
    contactPriceLabel: string;

    @Prop({ required: true })
    savingsLabel: string;

    @Prop({ type: [String], required: true })
    priceNotes: string[];

    @Prop({ type: [String], required: true })
    infoNotes: string[];

    @Prop({ required: true })
    ctaButtonText: string;

    @Prop({ required: true })
    ctaSubtext: string;

    @Prop({ required: true })
    detailCardTitle: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ default: true })
    isActive: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const PricingSettingSchema = SchemaFactory.createForClass(PricingSetting); 