import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import { ImageService } from './image.service';

@Injectable()
export class FileService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imageService: ImageService,
  ) {}

  /**
   * 파일 확장자가 허용된 형식인지 검사합니다.
   * @param filename 파일 이름
   * @param allowedExtensions 허용된 확장자 배열
   * @returns 허용 여부
   */
  validateFileExtension(
    filename: string,
    allowedExtensions: string[] = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
    ],
  ): boolean {
    const ext = filename.split('.').pop().toLowerCase();
    return allowedExtensions.includes(ext);
  }

  /**
   * 파일 크기가 제한을 초과하는지 검사합니다. (기본 10MB)
   * @param fileSize 파일 크기 (bytes)
   * @param maxSize 최대 허용 크기 (bytes)
   * @returns
   */
  validateFileSize(
    fileSize: number,
    maxSize: number = 10 * 1024 * 1024,
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
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    // 파일 확장자 검사
    const allowedExtensions = options?.allowedExtensions || [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
    ];
    if (!this.validateFileExtension(file.originalname, allowedExtensions)) {
      throw new BadRequestException(
        `허용되지 않은 파일 형식입니다. 허용된 형식: ${allowedExtensions.join(', ')}`,
      );
    }

    // 파일 크기 검사
    const maxSize = options?.maxSize || 10 * 1024 * 1024; // 기본 10MB
    if (!this.validateFileSize(file.size, maxSize)) {
      throw new BadRequestException(
        `파일 크기가 제한을 초과합니다. 최대 ${maxSize / (1024 * 1024)}MB까지 허용됩니다.`,
      );
    }

    let fileToUpload = file;
    let modifiedMimeType = file.mimetype;
    let modifiedOriginalName = file.originalname;

    // 이미지 압축 옵션이 활성화되고, 이미지이며, 변환 가능한 형식인 경우
    if (
      options?.compressImage !== false && // 명시적으로 false가 아니면 압축 수행
      this.imageService.isImage(file.mimetype) &&
      this.imageService.isConvertibleToWebp(file.mimetype)
    ) {
      try {
        // 이미지를 WebP로 변환
        const webpBuffer = await this.imageService.convertToWebp(file.buffer, {
          quality: options?.imageOptions?.quality || 80,
          width: options?.imageOptions?.width,
          height: options?.imageOptions?.height,
        });

        // 변환된 이미지로 파일 객체 수정
        fileToUpload = {
          ...file,
          buffer: webpBuffer,
          mimetype: 'image/webp',
        };

        // 확장자를 WebP로 변경
        modifiedMimeType = 'image/webp';
        modifiedOriginalName =
          file.originalname.split('.').slice(0, -1).join('.') + '.webp';

        console.log(
          `이미지가 WebP로 성공적으로 변환되었습니다: ${modifiedOriginalName}`,
        );
      } catch (error) {
        console.error('이미지 변환 실패, 원본 파일을 업로드합니다:', error);
        // 변환에 실패한 경우 원본 파일 사용
      }
    }

    // S3에 업로드
    const result = await this.s3Service.uploadFile(fileToUpload, folder);

    return {
      ...result,
      originalName: modifiedOriginalName,
      mimeType: modifiedMimeType,
    };
  }

  /**
   * 파일을 삭제합니다.
   * @param key 파일의 S3 키
   */
  async deleteFile(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException('삭제할 파일 키가 제공되지 않았습니다.');
    }

    await this.s3Service.deleteFile(key);
  }
}
