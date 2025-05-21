import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
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
      fit?: keyof sharp.FitEnum; // 맞춤 방식 (cover, contain, fill, inside, outside)
    },
  ): Promise<Buffer> {
    try {
      const quality = options?.quality || 80;
      let sharpInstance = sharp(buffer);

      // 이미지 리사이징 적용 (너비나 높이가 지정된 경우)
      if (options?.width || options?.height) {
        sharpInstance = sharpInstance.resize({
          width: options?.width,
          height: options?.height,
          fit: options?.fit || 'contain',
          withoutEnlargement: true, // 원본보다 크게 확대하지 않음
        });
      }

      // WebP 형식으로 변환
      return await sharpInstance.webp({ quality }).toBuffer();
    } catch (error) {
      console.error('이미지 변환 오류:', error);
      throw new Error('이미지 변환 중 오류가 발생했습니다.');
    }
  }

  /**
   * 이미지 정보를 가져옵니다.
   * @param buffer 이미지 버퍼
   * @returns 이미지 메타데이터
   */
  async getImageInfo(buffer: Buffer): Promise<sharp.Metadata> {
    return await sharp(buffer).metadata();
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
      'image/png',
      'image/gif',
      'image/tiff',
      'image/svg+xml',
      'image/bmp',
    ];
    return convertibleTypes.includes(mimetype);
  }
}
