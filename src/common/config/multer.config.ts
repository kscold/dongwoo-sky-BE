import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const twentyMb = 20 * 1024 * 1024;

export const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: twentyMb, files: 10 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|heic|heif|avif)$/)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(`Unsupported file type ${file.mimetype}`),
        false,
      );
    }
  },
};
