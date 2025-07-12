import { IsString, IsEmail, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateContactInquiryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsNotEmpty()
  inquiryType: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsBoolean()
  @IsOptional()
  privacyAgreed?: boolean;

  @IsBoolean()
  @IsOptional()
  marketingAgreed?: boolean;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;
}