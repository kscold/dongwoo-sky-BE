export class AdminPricingSettingResponseDto {
    _id: string;
    mainTitle: string;
    mainSubtitle: string;
    discountBannerTitle: string;
    discountBannerSubtitle: string;
    discountPercentage: number;
    equipmentSectionTitle: string;
    equipmentSectionDescription: string;
    timeSectionTitle: string;
    timeSectionDescription: string;
    priceCardTitle: string;
    onlinePriceLabel: string;
    contactPriceLabel: string;
    savingsLabel: string;
    priceNotes: string[];
    infoNotes: string[];
    ctaButtonText: string;
    ctaSubtext: string;
    detailCardTitle: string;
    phoneNumber: string;
    // 추가 UI 라벨들
    timeSelectionLabel: string;
    hourUnit: string;
    baseHoursLabel: string;
    additionalHoursLabel: string;
    hourlyRateLabel: string;
    specificationsLabel: string;
    scrollLeftAriaLabel: string;
    scrollRightAriaLabel: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
} 