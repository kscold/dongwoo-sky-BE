export class AdminEquipmentResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  specifications?: string;
  priceRange?: string;
  tonnage?: string;
  maxHeight?: string;
  maxWeight?: string;
  iconUrl?: string;
  priceRanges?: string[];
  showInService: boolean;
  showInPricing: boolean;
  createdAt: Date;
  updatedAt: Date;
}
