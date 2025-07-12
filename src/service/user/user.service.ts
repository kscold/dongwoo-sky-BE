import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schema/user.schema';
import { UserCreateRequestDto } from './dto/request/user-create-request.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async register(dto: UserCreateRequestDto): Promise<UserDocument> {
    try {
      const existingUser = await this.userModel.findOne({ email: dto.email });
      if (existingUser) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = new this.userModel({
        ...dto,
        password: hashedPassword,
        isApproved: false, // Public registrations require admin approval
      });

      const savedUser = await user.save();
      const result = savedUser.toObject();
      delete result.password;

      return result as UserDocument;
    } catch (error) {
      this.logger.error(`[register] ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('회원가입 중 오류가 발생했습니다.');
    }
  }
}
