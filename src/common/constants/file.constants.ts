/**
 * 파일 관련 상수들
 */

// 허용된 이미지 확장자
export const ALLOWED_IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'heic',
  'heif',
  'avif',
] as const;

// 허용된 문서 확장자
export const ALLOWED_DOCUMENT_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
] as const;

// 모든 허용된 확장자
export const ALLOWED_ALL_EXTENSIONS = [
  ...ALLOWED_IMAGE_EXTENSIONS,
  ...ALLOWED_DOCUMENT_EXTENSIONS,
] as const;

// 파일 크기 제한 (bytes)
export const FILE_SIZE_LIMITS = {
  IMAGE: 15 * 1024 * 1024, // 15MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  DEFAULT: 10 * 1024 * 1024, // 10MB
} as const;

// 이미지 압축 설정
export const IMAGE_COMPRESSION_OPTIONS = {
  QUALITY: 85,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
} as const;

// 업로드 폴더 경로
export const UPLOAD_FOLDERS = {
  CUSTOMER_REVIEWS: 'customer-reviews',
  WORK_SHOWCASE: 'work-showcase',
  HOME_HERO: 'home/hero',
  EQUIPMENT: 'equipment',
  NOTICE: 'notice',
  PROFILES: 'profiles',
} as const;