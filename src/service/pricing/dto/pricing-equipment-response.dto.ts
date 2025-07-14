export class PricingEquipmentResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  iconUrl?: string;
  basePrice?: number;
  hourlyRate?: number;
  baseHours?: number;
  minHours?: number;
  maxHours?: number;
  priceRanges?: string[];
  workingTimeRanges?: string[];
}
