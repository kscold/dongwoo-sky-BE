import { AdminHomeHeroTitleResponseDto } from './admin-home-hero-title.response.dto';
import { AdminHomeHeroButtonsResponseDto } from './admin-home-hero-buttons.response.dto';

export interface ContentSetting {
    _id?: string;
    key: string;
    title: string;
    description: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export class AdminHomeResponseDto {
    _id?: string;
    pageId: string;
    heroTitle: AdminHomeHeroTitleResponseDto;
    heroSubtitle: string;
    heroImages: string[];
    heroButtons: AdminHomeHeroButtonsResponseDto;
    contentSettings?: ContentSetting[];
    isActive: boolean;
    sortOrder: number;
}
