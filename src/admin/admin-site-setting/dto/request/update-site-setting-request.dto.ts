import { IsOptional, IsString, IsUrl } from "class-validator"

export class UpdateSiteSettingDto {
    @IsString()
    @IsOptional()
    contactPhoneNumber?: string

    @IsUrl()
    @IsOptional()
    kakaoOpenChatUrl?: string

    @IsString()
    @IsOptional()
    metaTitle?: string

    @IsString()
    @IsOptional()
    metaDescription?: string

    @IsString()
    @IsOptional()
    metaKeywords?: string

    @IsString()
    @IsOptional()
    companyName?: string

    @IsString()
    @IsOptional()
    businessRegistrationNumber?: string

    @IsString()
    @IsOptional()
    address?: string
} 