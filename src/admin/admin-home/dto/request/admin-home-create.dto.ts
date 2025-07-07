import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsBoolean,
} from "class-validator"
import { Type } from "class-transformer"

class HeroButtonDto {
  @IsString()
  @IsNotEmpty()
  text: string

  @IsString()
  @IsNotEmpty()
  link: string
}

class HeroSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  companyName: string

  @IsString()
  @IsNotEmpty()
  highlightText: string

  @IsString()
  @IsNotEmpty()
  subtitle: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroButtonDto)
  ctaButtons: HeroButtonDto[]

  @IsArray()
  backgroundImages: any[]

  @IsBoolean()
  isActive: boolean
}

export class AdminHomeCreateDto {
  @ValidateNested()
  @Type(() => HeroSectionDto)
  heroSection: HeroSectionDto
}
