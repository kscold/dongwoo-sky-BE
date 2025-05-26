import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly cloudfrontDomain: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION');
    this.bucketName =
      this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
    this.cloudfrontDomain =
      this.configService.get<string>('AWS_CLOUDFRONT_DOMAIN') || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  /**
   * S3에 파일을 업로드합니다.
   * @param file 업로드할 파일 (multer에서 제공하는 파일 객체)
   * @param folder 파일을 저장할 폴더 경로 (예: 'notices', 'profiles')
   * @param options 추가 옵션 (변환된 파일 타입 등)
   * @returns 업로드된 파일의 URL과 키
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    options?: {
      originalName?: string;
      mimeType?: string;
    },
  ): Promise<{ url: string; key: string }> {
    try {
      // 파일 이름 생성 (고유 ID + 원본 파일명)
      const uniqueId = uuidv4();

      // 파일명 및 확장자 결정 (변환된 경우 수정됨)
      const originalName = options?.originalName || file.originalname;
      let fileExtension = originalName.split('.').pop()?.toLowerCase();

      // 수정된 MIME 타입을 기반으로 확장자 결정
      if (options?.mimeType === 'image/webp') {
        fileExtension = 'webp';
      }

      const fileName = `${uniqueId}_${Date.now()}.${fileExtension}`;
      const key = `${folder}/${fileName}`;

      // S3에 파일 업로드
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline', // 또는 'attachment'
      });

      await this.s3Client.send(command);

      // S3 직접 접근 URL
      const s3Url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      // CloudFront URL 반환 (CloudFront 도메인이 설정된 경우)
      let url = s3Url;
      if (this.cloudfrontDomain) {
        // cloudfrontDomain에 이미 https://가 포함되어 있지 않은 경우에만 추가
        if (this.cloudfrontDomain.startsWith('http')) {
          url = `${this.cloudfrontDomain}/${key}`;
        } else {
          url = `https://${this.cloudfrontDomain}/${key}`;
        }
      }

      console.log(`생성된 URL: ${url}`);
      return {
        url,
        key,
      };
    } catch (error) {
      console.error('S3 파일 업로드 오류:', error);
      throw error;
    }
  }

  /**
   * S3에서 파일을 삭제합니다.
   * @param key 삭제할 파일의 S3 키
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('S3 파일 삭제 오류:', error);
      throw error;
    }
  }

  /**
   * S3 파일에 접근할 수 있는 서명된 URL을 생성합니다.
   * 업로드나 다운로드를 위한 임시 URL을 생성할 때 사용합니다.
   * @param key 파일의 S3 키
   * @param expiresIn URL 만료 시간 (초, 기본값 60초)
   */
  async getSignedUrl(key: string, expiresIn: number = 60): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
