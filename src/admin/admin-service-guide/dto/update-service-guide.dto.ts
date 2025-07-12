import { Type } from "class-transformer"
import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsUrl,
} from "class-validator"

class ScopeOfWorkItemDto {
    @IsString()
    icon: string

    @IsString()
    text: string
}

class ProfileDto {
    @IsString()
    name: string

    @IsString()
    role: string

    @IsString()
    introduction: string

    @IsUrl()
    @IsOptional()
    imageUrl?: string

    @IsArray()
    @IsString({ each: true })
    career: string[]

    @IsArray()
    @IsString({ each: true })
    skills: string[]
}

class ProcessStepDto {
    @IsString()
    icon: string

    @IsString()
    title: string

    @IsString()
    description: string
}

export class UpdateServiceGuideDto {
    @IsString()
    @IsOptional()
    heroTitle?: string

    @IsString()
    @IsOptional()
    heroSubtitle?: string

    @IsString()
    @IsOptional()
    equipmentSectionTitle?: string

    @IsString()
    @IsOptional()
    scopeOfWorkSectionTitle?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScopeOfWorkItemDto)
    @IsOptional()
    scopeOfWork?: ScopeOfWorkItemDto[]

    @IsString()
    @IsOptional()
    profileSectionTitle?: string

    @ValidateNested()
    @Type(() => ProfileDto)
    @IsOptional()
    profile?: ProfileDto

    @IsString()
    @IsOptional()
    processSectionTitle?: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessStepDto)
    @IsOptional()
    processSteps?: ProcessStepDto[]
} 