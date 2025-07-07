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
  ) { }

  async findAll(): Promise<WorkShowcase[]> {
    try {
      return this.workShowcaseModel
        .find({ isActive: true })
        .sort({ publishedAt: -1 })
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

      // 조회수 증가
      await this.incrementViewCount(id);

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

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.workShowcaseModel
        .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
        .exec();
    } catch (error) {
      // 조회수 증가 실패는 중요하지 않으므로 에러를 던지지 않음
      console.error(`조회수 증가 실패: ${id}`, error);
    }
  }

  async incrementLikeCount(id: string): Promise<{ likeCount: number }> {
    try {
      const workShowcase = await this.workShowcaseModel
        .findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true })
        .exec();

      if (!workShowcase) {
        throw new NotFoundException(`작업자 자랑거리를 찾을 수 없습니다: ${id}`);
      }

      return { likeCount: workShowcase.likeCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `좋아요 증가 중 오류가 발생했습니다: ${id}`,
      );
    }
  }
}
