import { memoryStorage } from 'multer';
import { ALLOWED_IMAGE_MIMES, FileUploadOptions } from '../dto/file.dto';

export const allowedMimes = [...ALLOWED_IMAGE_MIMES];

export const fileUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`지원하지 않는 이미지 형식입니다: ${file.mimetype}`), false);
    }
  },
} as const;

export const fileUploadConfig: FileUploadOptions = {
  maxFileSize: 20 * 1024 * 1024, // 20MB
  maxFiles: 10,
  allowedMimes: ALLOWED_IMAGE_MIMES,
};
