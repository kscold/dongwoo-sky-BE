import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WorkShowcase,
  WorkShowcaseDocument,
} from '../../schema/work-showcase.schema';

@Injectable()
export class WorkShowcaseService {
  constructor(
    @InjectModel(WorkShowcase.name)
    private workShowcaseModel: Model<WorkShowcaseDocument>,
  ) {}

  async findAll(page: number, limit: number): Promise<WorkShowcase[]> {
    try {
      return this.workShowcaseModel
        .find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    } catch (error) {
      // TODO: Add logger
      throw new InternalServerErrorException(
        '작업 사례 목록을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  async findOne(id: string): Promise<WorkShowcase> {
    try {
      const showcase = await this.workShowcaseModel.findById(id).exec();
      if (!showcase) {
        throw new NotFoundException(`Work showcase with ID "${id}" not found`);
      }
      return showcase;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // TODO: Add logger
      throw new InternalServerErrorException(
        `작업 사례를 가져오는 중 오류가 발생했습니다: ${id}`,
      );
    }
  }
}
