import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray,
    Min,
    Max,
} from 'class-validator';

export class AdminPricingSettingUpdateRequestDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    @IsOptional()
    mainTitle?: string;

    @IsString()
    @IsOptional()
    mainSubtitle?: string;

    @IsString()
    @IsOptional()
    discountBannerTitle?: string;

    @IsString()
    @IsOptional()
    discountBannerSubtitle?: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    discountPercentage?: number;

    @IsString()
    @IsOptional()
    equipmentSectionTitle?: string;

    @IsString()
    @IsOptional()
    equipmentSectionDescription?: string;

    @IsString()
    @IsOptional()
    timeSectionTitle?: string;

    @IsString()
    @IsOptional()
    timeSectionDescription?: string;

    @IsString()
    @IsOptional()
    priceCardTitle?: string;

    @IsString()
    @IsOptional()
    onlinePriceLabel?: string;

    @IsString()
    @IsOptional()
    contactPriceLabel?: string;

    @IsString()
    @IsOptional()
    savingsLabel?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    priceNotes?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    infoNotes?: string[];

    @IsString()
    @IsOptional()
    ctaButtonText?: string;

    @IsString()
    @IsOptional()
    ctaSubtext?: string;

    @IsString()
    @IsOptional()
    detailCardTitle?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
} 