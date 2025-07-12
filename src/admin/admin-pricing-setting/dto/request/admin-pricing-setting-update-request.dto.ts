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

    // 추가 UI 라벨들
    @IsString()
    @IsOptional()
    timeSelectionLabel?: string;

    @IsString()
    @IsOptional()
    hourUnit?: string;

    @IsString()
    @IsOptional()
    baseHoursLabel?: string;

    @IsString()
    @IsOptional()
    additionalHoursLabel?: string;

    @IsString()
    @IsOptional()
    hourlyRateLabel?: string;

    @IsString()
    @IsOptional()
    specificationsLabel?: string;

    @IsString()
    @IsOptional()
    scrollLeftAriaLabel?: string;

    @IsString()
    @IsOptional()
    scrollRightAriaLabel?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
} 