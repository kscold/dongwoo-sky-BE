/**
 * 파일 업로드 관련 DTO
 */

// 지원되는 이미지 MIME 타입
export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif',
] as const;

export type AllowedImageMime = typeof ALLOWED_IMAGE_MIMES[number];

// 파일 업로드 설정
export interface FileUploadOptions {
  maxFileSize: number; // bytes
  maxFiles: number;
  allowedMimes: readonly string[];
}

// 업로드된 파일 정보
export interface UploadedFile {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

// S3 업로드 결과
export interface S3UploadResult {
  url: string;
  key: string;
  name: string;
}

// 이미지 정보 (Hero Section 등에서 사용)
export interface ImageInfo {
  url: string;
  key: string;
  name: string;
  order?: number;
  isActive?: boolean;
}

// WebP 변환 옵션
export interface WebPConversionOptions {
  quality?: number;
  lossless?: boolean;
  nearLossless?: boolean;
}