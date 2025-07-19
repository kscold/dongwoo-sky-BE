import { PartialType } from '@nestjs/mapped-types';
import { CreateSitemapConfigDto } from './create-sitemap-config.dto';

export class UpdateSitemapConfigDto extends PartialType(CreateSitemapConfigDto) {}