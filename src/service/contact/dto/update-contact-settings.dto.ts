import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdateContactSettingsDto {
    @IsOptional()
    @IsString()
    pageTitle?: string;

    @IsOptional()
    @IsString()
    pageSubtitle?: string;

    @IsOptional()
    @IsString()
    pageDescription?: string;

    @IsOptional()
    @IsString()
    contactSectionTitle?: string;

    @IsOptional()
    @IsString()
    contactSectionDescription?: string;

    @IsOptional()
    @IsString()
    businessName?: string;

    @IsOptional()
    @IsString()
    businessAddress?: string;

    @IsOptional()
    @IsString()
    businessPhone?: string;

    @IsOptional()
    @IsString()
    businessEmail?: string;

    @IsOptional()
    @IsString()
    businessFax?: string;

    @IsOptional()
    @IsString()
    operatingHours?: string;

    @IsOptional()
    businessDays?: string[];

    @IsOptional()
    @IsString()
    kakaoTalkId?: string;

    @IsOptional()
    @IsString()
    naverTalkId?: string;

    @IsOptional()
    @IsString()
    instagramUrl?: string;

    @IsOptional()
    @IsString()
    facebookUrl?: string;

    @IsOptional()
    @IsString()
    youtubeUrl?: string;

    @IsOptional()
    @IsString()
    formTitle?: string;

    @IsOptional()
    @IsString()
    formDescription?: string;

    @IsOptional()
    inquiryTypes?: string[];

    @IsOptional()
    @IsString()
    submitButtonText?: string;

    @IsOptional()
    @IsString()
    successMessage?: string;

    @IsOptional()
    @IsString()
    errorMessage?: string;

    @IsOptional()
    privacyNotes?: string[];

    @IsOptional()
    @IsString()
    emergencyContactTitle?: string;

    @IsOptional()
    @IsString()
    emergencyContactDescription?: string;

    @IsOptional()
    @IsString()
    emergencyPhone?: string;

    @IsOptional()
    @IsString()
    emergencyHours?: string;

    @IsOptional()
    @IsString()
    mapTitle?: string;

    @IsOptional()
    @IsString()
    mapDescription?: string;

    @IsOptional()
    latitude?: number;

    @IsOptional()
    longitude?: number;

    @IsOptional()
    @IsString()
    mapApiKey?: string;

    // Discord 웹훅 설정
    @IsOptional()
    @IsUrl()
    discordWebhookUrl?: string;

    @IsOptional()
    @IsBoolean()
    discordEnabled?: boolean;

    @IsOptional()
    @IsString()
    discordMessageTitle?: string;

    @IsOptional()
    @IsString()
    discordEmbedColor?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
