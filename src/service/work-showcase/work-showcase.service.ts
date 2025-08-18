import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WorkShowcase,
  WorkShowcaseDocument,
} from '../../schema/work-showcase.schema';

@Injectable()
export class WorkShowcaseService {
  private readonly logger = new Logger(WorkShowcaseService.name);

  constructor(
    @InjectModel(WorkShowcase.name)
    private workShowcaseModel: Model<WorkShowcaseDocument>,
  ) { }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [items, total] = await Promise.all([
        this.workShowcaseModel
          .find({ isActive: true })
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.workShowcaseModel.countDocuments({ isActive: true }).exec(),
      ]);

      // 각 아이템에 summary 추가
      const dataWithSummary = items.map(item => {
        const itemObj = item.toObject();
        return {
          ...itemObj,
          summary: this.generateSummary(item.content),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: dataWithSummary,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error('작업 사례 목록 조회 실패:', error);
      throw new BadRequestException('작업 사례 목록을 불러올 수 없습니다.');
    }
  }

  private generateSummary(content: string): string {
    if (!content) return '';
    
    // HTML 태그 제거
    const textOnly = content.replace(/<[^>]*>/g, '');
    // 연속된 공백 및 줄바꿈 정리
    const cleaned = textOnly.replace(/\s+/g, ' ').trim();
    // 150자로 제한하고 말줄임표 추가
    return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned;
  }

  async findOne(id: string): Promise<WorkShowcase> {
    try {
      const showcase = await this.workShowcaseModel.findOne({ _id: id, isActive: true }).exec();
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
      this.logger.error(`작업 사례 조회 실패: ${id}`, error);
      throw new BadRequestException('작업 사례를 불러올 수 없습니다.');
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.workShowcaseModel
        .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
        .exec();
    } catch (error) {
      // 조회수 증가 실패는 중요하지 않으므로 에러를 던지지 않음
      this.logger.warn(`조회수 증가 실패: ${id}`, error.message);
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
      this.logger.error(`좋아요 증가 실패: ${id}`, error);
      throw new BadRequestException('좋아요 표시에 실패했습니다.');
    }
  }
}
