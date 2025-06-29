import { IsString } from 'class-validator';

export class AdminHomeCreateHeroButtonsDto {
  @IsString()
  primaryButtonText: string;

  @IsString()
  primaryButtonLink: string;

  @IsString()
  secondaryButtonText: string;

  @IsString()
  secondaryButtonLink: string;
}
