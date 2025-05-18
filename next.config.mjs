import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 여기에 다른 Next.js 설정을 추가할 수 있습니다.
  // 예: reactStrictMode: true,
};

export default withVanillaExtract(nextConfig); 