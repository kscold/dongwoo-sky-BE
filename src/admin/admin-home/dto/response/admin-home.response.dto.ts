import { AdminHomeHeroTitleResponseDto } from './admin-home-hero-title.response.dto';
import { AdminHomeHeroButtonsResponseDto } from './admin-home-hero-buttons.response.dto';

export class AdminHomeResponseDto {
  _id?: string;
  pageId: string;
  heroTitle: AdminHomeHeroTitleResponseDto;
  heroSubtitle: string;
  heroImages: string[];
  heroButtons: AdminHomeHeroButtonsResponseDto;
  isActive: boolean;
  sortOrder: number;
}
