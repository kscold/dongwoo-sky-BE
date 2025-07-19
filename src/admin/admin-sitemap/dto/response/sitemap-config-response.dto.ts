export class SitemapConfigResponseDto {
  id: string;
  url: string;
  type: 'static' | 'dynamic';
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  isActive: boolean;
  lastModified: Date;
  description: string;
  category: string;
  sortOrder: number;
  includeInSitemap: boolean;
  allowRobots: boolean;
  createdAt: Date;
  updatedAt: Date;
}