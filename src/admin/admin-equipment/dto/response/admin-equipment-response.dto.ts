export class AdminEquipmentResponseDto {
  id: string;
  name: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly isPublished: boolean;
  readonly sortOrder: number;
  readonly tonnage: string;
  specifications?: string;
  capabilities?: string[];
  priceRange?: string;
  maxHeight?: string;
  maxWeight?: string;
  iconUrl?: string;
  priceRanges?: string[];
  showInService: boolean;
  showInPricing: boolean;
  createdAt: Date;
  updatedAt: Date;

  // 새로운 가격 관련 필드들
  basePrice?: number;
  hourlyRate?: number;
  baseHours?: number;
  minHours?: number;
  maxHours?: number;
  workingTimeRanges?: string[];
}
