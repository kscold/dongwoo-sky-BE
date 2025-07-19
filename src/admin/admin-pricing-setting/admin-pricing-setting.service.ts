import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PricingSetting, PricingSettingDocument } from '../../schema/pricing-setting.schema';
import { AdminPricingSettingUpdateRequestDto } from './dto/request/admin-pricing-setting-update-request.dto';
import { AdminPricingSettingResponseDto } from './dto/response/admin-pricing-setting-response.dto';
import { DEFAULT_PRICING_SETTINGS } from '../../common/constants/default-pricing-settings.constant';

@Injectable()
export class AdminPricingSettingService {
    constructor(
        @InjectModel(PricingSetting.name)
        private pricingSettingModel: Model<PricingSettingDocument>,
    ) { }

    async getPricingSettings(): Promise<AdminPricingSettingResponseDto> {
        let pricingSetting: PricingSettingDocument | null = await this.pricingSettingModel.findOne({ isActive: true }).exec();

        if (!pricingSetting) {
            pricingSetting = await this.createDefaultPricingSetting();
        }

        return this.mapToResponseDto(pricingSetting);
    }

    async updatePricingSettings(updateDto: AdminPricingSettingUpdateRequestDto): Promise<AdminPricingSettingResponseDto> {
        const { id, ...updateData } = updateDto;

        let pricingSetting: PricingSettingDocument | null;

        if (id) {
            pricingSetting = await this.pricingSettingModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).exec();

            if (!pricingSetting) {
                pricingSetting = await this.createDefaultPricingSetting();
            }
        } else {
            pricingSetting = await this.createDefaultPricingSetting();
        }

        return this.mapToResponseDto(pricingSetting);
    }

    private async createDefaultPricingSetting(): Promise<PricingSettingDocument> {
        return await this.pricingSettingModel.create(DEFAULT_PRICING_SETTINGS);
    }

    private mapToResponseDto(pricingSetting: PricingSettingDocument): AdminPricingSettingResponseDto {
        return {
            _id: pricingSetting._id.toString(),
            mainTitle: pricingSetting.mainTitle,
            mainSubtitle: pricingSetting.mainSubtitle,
            discountBannerTitle: pricingSetting.discountBannerTitle,
            discountBannerSubtitle: pricingSetting.discountBannerSubtitle,
            discountPercentage: pricingSetting.discountPercentage,
            equipmentSectionTitle: pricingSetting.equipmentSectionTitle,
            equipmentSectionDescription: pricingSetting.equipmentSectionDescription,
            timeSectionTitle: pricingSetting.timeSectionTitle,
            timeSectionDescription: pricingSetting.timeSectionDescription,
            priceCardTitle: pricingSetting.priceCardTitle,
            onlinePriceLabel: pricingSetting.onlinePriceLabel,
            contactPriceLabel: pricingSetting.contactPriceLabel,
            savingsLabel: pricingSetting.savingsLabel,
            priceNotes: pricingSetting.priceNotes,
            infoNotes: pricingSetting.infoNotes,
            ctaButtonText: pricingSetting.ctaButtonText,
            ctaSubtext: pricingSetting.ctaSubtext,
            detailCardTitle: pricingSetting.detailCardTitle,
            phoneNumber: pricingSetting.phoneNumber,
            // 추가 UI 라벨들
            timeSelectionLabel: pricingSetting.timeSelectionLabel,
            hourUnit: pricingSetting.hourUnit,
            baseHoursLabel: pricingSetting.baseHoursLabel,
            additionalHoursLabel: pricingSetting.additionalHoursLabel,
            hourlyRateLabel: pricingSetting.hourlyRateLabel,
            specificationsLabel: pricingSetting.specificationsLabel,
            scrollLeftAriaLabel: pricingSetting.scrollLeftAriaLabel,
            scrollRightAriaLabel: pricingSetting.scrollRightAriaLabel,
            isActive: pricingSetting.isActive,
            createdAt: pricingSetting.createdAt,
            updatedAt: pricingSetting.updatedAt,
        };
    }
} 