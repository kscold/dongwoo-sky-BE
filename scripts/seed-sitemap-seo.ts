import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AdminSitemapService } from '../src/admin/admin-sitemap/admin-sitemap.service';
import { AdminSeoService } from '../src/admin/admin-seo/admin-seo.service';

async function seedSitemapAndSeo() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const adminSitemapService = app.get(AdminSitemapService);
    const adminSeoService = app.get(AdminSeoService);

    console.log('🌱 Seeding sitemap configurations...');
    const sitemapCount = await adminSitemapService.initializeDefaultSitemapConfigs();
    console.log(`✅ Created ${sitemapCount} sitemap configurations`);

    console.log('🌱 Seeding SEO data...');
    const seoCount = await adminSeoService.initializeDefaultPageSeo();
    console.log(`✅ Created ${seoCount} SEO configurations`);

    console.log('🎉 Sitemap and SEO seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding sitemap and SEO data:', error);
  } finally {
    await app.close();
  }
}

seedSitemapAndSeo();