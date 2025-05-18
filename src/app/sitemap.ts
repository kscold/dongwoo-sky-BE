import { MetadataRoute } from 'next';

// 나중에 웹사이트 실제 도메인으로 변경해야 합니다.
const BASE_URL = 'https://YOUR_DOMAIN.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/pricing',
    '/contact',
    // 여기에 정적 경로를 추가합니다.
    // 예: '/services'
  ];

  const routes = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    // changeFrequency 및 priority는 필요에 따라 설정
    // changeFrequency: 'weekly',
    // priority: 0.8,
  }));

  return routes;
} 