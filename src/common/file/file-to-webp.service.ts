import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  private sharp: typeof import('sharp') | null = null;

  constructor() {
    // Lambda 환경에서는 sharp를 사용하지 않음
    if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
      try {
        this.sharp = require('sharp');
      } catch (error) {
        console.warn('Sharp is not available in this environment');
      }
    }
  }
  /**
   * 이미지를 WebP 형식으로 변환합니다.
   * @param buffer 원본 이미지 버퍼
   * @param options 변환 옵션
   * @returns 변환된 이미지 버퍼
   */
  async convertToWebp(
    buffer: Buffer,
    options?: {
      quality?: number; // 품질 (1-100, 기본값 80)
      width?: number; // 너비 (픽셀)
      height?: number; // 높이 (픽셀)
      fit?: string; // 맞춤 방식 (cover, contain, fill, inside, outside)
    },
  ): Promise<Buffer> {
    if (!this.sharp) {
      // Sharp가 없는 환경에서는 원본 버퍼를 그대로 반환
      console.log('Sharp not available, returning original buffer');
      return buffer;
    }

    try {
      const quality = options?.quality || 80;
      let sharpInstance = this.sharp(buffer);

      // 이미지 리사이징 적용 (너비나 높이가 지정된 경우)
      if (options?.width || options?.height) {
        sharpInstance = sharpInstance.resize({
          width: options?.width,
          height: options?.height,
          fit: (options?.fit as any) || 'contain',
          withoutEnlargement: true, // 원본보다 크게 확대하지 않음
        });
      }

      // WebP 형식으로 변환
      return await sharpInstance.webp({ quality }).toBuffer();
    } catch (error) {
      console.error('이미지 변환 오류:', error);
      // 변환에 실패한 경우 원본 버퍼 반환
      console.log('Image conversion failed, returning original buffer');
      return buffer;
    }
  }

  /**
   * 이미지 정보를 가져옵니다.
   * @param buffer 이미지 버퍼
   * @returns 이미지 메타데이터
   */
  async getImageInfo(buffer: Buffer): Promise<any> {
    if (!this.sharp) {
      // Lambda 환경에서는 기본 정보 반환
      return {
        format: 'unknown',
        width: 0,
        height: 0,
      };
    }
    return await this.sharp(buffer).metadata();
  }

  /**
   * 입력된 파일이 이미지인지 확인합니다.
   * @param mimetype 파일의 MIME 타입
   * @returns 이미지 여부
   */
  isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  /**
   * 입력된 파일이 WebP로 변환 가능한지 확인합니다.
   * @param mimetype 파일의 MIME 타입
   * @returns 변환 가능 여부
   */
  isConvertibleToWebp(mimetype: string): boolean {
    const convertibleTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/tiff',
      'image/svg+xml',
      'image/bmp',
      'image/heic',
      'image/heif',
      'image/avif',
    ];

    // 파일 타입이 image로 시작하면 변환 시도
    if (mimetype.startsWith('image/') && !mimetype.includes('webp')) {
      return true;
    }

    return convertibleTypes.includes(mimetype);
  }
}
