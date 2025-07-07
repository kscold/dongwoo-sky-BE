import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
} from "class-validator"
import { Type } from "class-transformer"

class HeroButtonDto {
    @IsString()
    text: string

    @IsString()
    link: string
}

class HeroSectionDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    companyName?: string

    @IsString()
    @IsOptional()
    highlightText?: string

    @IsString()
    @IsOptional()
    subtitle?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HeroButtonDto)
    @IsOptional()
    ctaButtons?: HeroButtonDto[]

    @IsArray()
    @IsOptional()
    backgroundImageUrls?: any[]

    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}

class ContentSettingDto {
    @IsString()
    @IsOptional()
    key?: string

    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsBoolean()
    @IsOptional()
    isActive?: boolean
}

export class AdminHomeUpdateDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => HeroSectionDto)
    heroSection?: HeroSectionDto

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContentSettingDto)
    @IsOptional()
    contentSettings?: ContentSettingDto[]
}
