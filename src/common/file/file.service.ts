import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileToWebpService } from './file-to-webp.service';
import { HeroImage } from '../../schema/home.schema';
import { fileUploadOptions, allowedMimes } from '../config/file-upload.config';
import { 
  ALLOWED_IMAGE_EXTENSIONS, 
  ALLOWED_DOCUMENT_EXTENSIONS, 
  ALLOWED_ALL_EXTENSIONS,
  FILE_SIZE_LIMITS,
  IMAGE_COMPRESSION_OPTIONS,
  UPLOAD_FOLDERS 
} from '../constants/file.constants';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

@Injectable()
export class FileService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly FileToWebpService: FileToWebpService,
  ) {}

  /**
   * 파일 확장자가 허용된 형식인지 검사합니다.
   * @param filename 파일 이름
   * @param allowedExtensions 허용된 확장자 배열
   * @returns 허용 여부
   */
  validateFileExtension(
    filename: string,
    allowedExtensions: readonly string[] = ALLOWED_ALL_EXTENSIONS,
  ): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? allowedExtensions.includes(ext) : false;
  }

  /**
   * 파일 크기가 제한을 초과하는지 검사합니다. (기본 10MB)
   * @param fileSize 파일 크기 (bytes)
   * @param maxSize 최대 허용 크기 (bytes)
   * @returns
   */
  validateFileSize(
    fileSize: number,
    maxSize: number = FILE_SIZE_LIMITS.DEFAULT,
  ): boolean {
    return fileSize <= maxSize;
  }

  /**
   * 파일을 업로드하고 URL을 반환합니다.
   * @param file Multer 파일 객체
   * @param folder 저장할 폴더 경로
   * @returns 업로드된 파일 정보
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    options?: {
      allowedExtensions?: string[];
      maxSize?: number;
      compressImage?: boolean; // 이미지 압축 여부
      imageOptions?: {
        quality?: number; // WebP 품질 (1-100)
        width?: number; // 너비 제한
        height?: number; // 높이 제한
      };
    },
  ): Promise<{
    url: string;
    key: string;
    originalName: string;
    mimeType: string;
  }> {
    // 파일이 없는 경우
    if (!file) {
      throw new BadRequestException(ERROR_MESSAGES.FILE_NOT_PROVIDED);
    }

    // 파일 버퍼 검증
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.FILE_EMPTY);
    }

    // 파일 확장자 검사
    const allowedExtensions = options?.allowedExtensions || [...ALLOWED_ALL_EXTENSIONS];
    if (!this.validateFileExtension(file.originalname, allowedExtensions)) {
      throw new BadRequestException(
        ERROR_MESSAGES.FILE_INVALID_EXTENSION(allowedExtensions),
      );
    }

    // 파일 크기 검사
    const maxSize = options?.maxSize || FILE_SIZE_LIMITS.DEFAULT;
    if (!this.validateFileSize(file.size, maxSize)) {
      throw new BadRequestException(
        ERROR_MESSAGES.FILE_SIZE_EXCEEDED(maxSize),
      );
    }

    let fileToUpload = file;
    let modifiedMimeType = file.mimetype;
    let modifiedOriginalName = file.originalname;

    console.log(
      `파일 업로드 처리 중: ${file.originalname}, MIME 타입: ${file.mimetype}`,
    );

    // 이미지 압축 옵션이 활성화되고, 이미지이며, 변환 가능한 형식인 경우
    if (
      options?.compressImage !== false && // 명시적으로 false가 아니면 압축 수행
      this.FileToWebpService.isImage(file.mimetype) &&
      this.FileToWebpService.isConvertibleToWebp(file.mimetype)
    ) {
      try {
        console.log(`이미지 파일 감지 - WebP 변환 시도: ${file.originalname}`);

        // 이미지를 WebP로 변환
        const webpBuffer = await this.FileToWebpService.convertToWebp(
          file.buffer,
          {
            quality: options?.imageOptions?.quality || IMAGE_COMPRESSION_OPTIONS.QUALITY,
            width: options?.imageOptions?.width || IMAGE_COMPRESSION_OPTIONS.MAX_WIDTH,
            height: options?.imageOptions?.height || IMAGE_COMPRESSION_OPTIONS.MAX_HEIGHT,
          },
        );

        // 변환이 성공하고 원본과 다른 경우에만 변환된 파일 사용
        if (webpBuffer && webpBuffer.length > 0 && webpBuffer !== file.buffer) {
          // 변환된 이미지로 파일 객체 수정
          fileToUpload = {
            ...file,
            buffer: webpBuffer,
            mimetype: 'image/webp',
          };

          // 확장자를 WebP로 변경
          modifiedMimeType = 'image/webp';

          // 파일명에서 확장자 제거하고 .webp 추가
          const fileNameParts = file.originalname.split('.');
          if (fileNameParts.length > 1) {
            fileNameParts.pop(); // 마지막 확장자 제거
          }
          modifiedOriginalName = fileNameParts.join('.') + '.webp';

          console.log(
            `이미지가 WebP로 성공적으로 변환되었습니다: ${modifiedOriginalName}`,
          );
        } else {
          console.log(
            'WebP 변환이 수행되지 않았거나 원본과 동일합니다. 원본 파일을 사용합니다.',
          );
        }
      } catch (error) {
        console.error(
          '이미지 변환 실패, 원본 파일을 업로드합니다:',
          error.message,
        );
        // 변환에 실패한 경우 원본 파일 사용
      }
    } else {
      console.log(
        `이미지 변환이 수행되지 않았습니다. 이미지가 아니거나 변환 불가능: ${file.mimetype}`,
      );
    }

    // S3에 업로드할 때 변경된 확장자 정보 전달
    const result = await this.s3Service.uploadFile(fileToUpload, folder, {
      originalName: modifiedOriginalName,
      mimeType: modifiedMimeType,
    });

    return {
      ...result,
      originalName: modifiedOriginalName,
      mimeType: modifiedMimeType,
    };
  }

  /**
   * 공통 파일 업로드: 이미지는 webp로 변환, S3 업로드, CloudFront URL 반환, HeroImage 객체 반환
   * @param file Multer 파일 객체
   * @param folder S3 업로드 폴더
   * @param order (선택) 이미지 순서
   */
  async uploadImageAsHeroImage(
    file: Express.Multer.File,
    folder: string,
    order = 0,
  ): Promise<HeroImage> {
    // 이미지 webp 변환 및 S3 업로드
    const uploadResult = await this.uploadFile(file, folder, {
      compressImage: true,
      imageOptions: {
        quality: IMAGE_COMPRESSION_OPTIONS.QUALITY,
        width: IMAGE_COMPRESSION_OPTIONS.MAX_WIDTH,
      },
      allowedExtensions: [...ALLOWED_IMAGE_EXTENSIONS],
      maxSize: FILE_SIZE_LIMITS.IMAGE,
    });
    // CloudFront URL 반환 (uploadResult.url)
    return {
      url: uploadResult.url,
      key: uploadResult.key,
      name: uploadResult.originalName,
      order,
      isActive: true,
    };
  }

  /**
   * 여러 이미지 파일을 HeroImage[]로 업로드 (webp 변환, S3, CloudFront)
   */
  async uploadImagesAsHeroImages(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<HeroImage[]> {
    const results: HeroImage[] = [];
    let order = 0;
    for (const file of files) {
      const heroImage = await this.uploadImageAsHeroImage(
        file,
        folder,
        order++,
      );
      results.push(heroImage);
    }
    return results;
  }

  /**
   * 파일을 삭제합니다.
   * @param key 파일의 S3 키
   */
  async deleteFile(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException(ERROR_MESSAGES.FILE_DELETE_KEY_MISSING);
    }

    await this.s3Service.deleteFile(key);
  }
}
