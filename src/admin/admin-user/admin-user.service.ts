import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument, UserRole } from '../../schema/user.schema';
import { AdminUserListResponseDto } from './dto/response/admin-user-list-response.dto';
import { AdminApproveUserRequestDto } from './dto/request/admin-user-approve-request.dto';
import { AdminUserCreateRequestDto } from './dto/request/admin-user-create-request.dto';
import { AdminUpdateUserRequestDto } from './dto/request/admin-user-update-request.dto';

@Injectable()
export class AdminUserService {
  private readonly logger = new Logger(AdminUserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`[findByEmail] ${error.message}`, error.stack);
      throw new BadRequestException(
        '이메일로 사용자를 찾는 중 오류가 발생했습니다.',
      );
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      this.logger.warn(`[validateUser] User not found: ${email}`);
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (user && isPasswordMatching) {
      const { password, ...result } = user.toObject();
      return result;
    }

    this.logger.warn(`[validateUser] Invalid password for user: ${email}`);
    throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.userModel
        .findByIdAndUpdate(id, { lastLoginAt: new Date() })
        .exec();
    } catch (error) {
      this.logger.error(`[updateLastLogin] ${error.message}`, error.stack);
      throw new BadRequestException(
        '마지막 로그인 시간 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async getUserList(): Promise<AdminUserListResponseDto> {
    try {
      const users = await this.userModel.find().lean();
      return {
        users: users.map((u) => ({
          _id: u._id.toString(),
          email: u.email,
          name: u.name,
          role: u.role,
          isApproved: u.isApproved,
          isActive: u.isActive,
          lastLoginAt: u.lastLoginAt,
        })),
      };
    } catch (error) {
      this.logger.error(`[getUserList] ${error.message}`, error.stack);
      throw new BadRequestException(
        '사용자 목록을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  async approveUser(
    dto: AdminApproveUserRequestDto,
  ): Promise<{ success: boolean }> {
    try {
      const user = await this.userModel.findById(dto.userId);
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      user.isApproved = true;
      await user.save();
      return { success: true };
    } catch (error) {
      this.logger.error(`[approveUser] ${error.message}`, error.stack);
      throw new BadRequestException('사용자 승인 중 오류가 발생했습니다.');
    }
  }

  async createUserByAdmin(
    dto: AdminUserCreateRequestDto,
  ): Promise<UserDocument> {
    const { email, password, ...rest } = dto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      ...rest,
      email,
      password: hashedPassword,
      isApproved: true,
    });

    return newUser.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).select('-password').exec();
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      return user;
    } catch (error) {
      this.logger.error(`[getUserById] ${error.message}`, error.stack);
      throw new BadRequestException(
        'ID로 사용자를 찾는 중 오류가 발생했습니다.',
      );
    }
  }

  async updateUserByAdmin(
    id: string,
    dto: AdminUpdateUserRequestDto,
  ): Promise<User> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, { $set: dto }, { new: true })
        .select('-password')
        .exec();
      if (!user) {
        throw new BadRequestException('사용자를 찾을 수 없습니다.');
      }
      return user;
    } catch (error) {
      this.logger.error(`[updateUserByAdmin] ${error.message}`, error.stack);
      throw new BadRequestException(
        '관리자에 의한 사용자 정보 수정 중 오류가 발생했습니다.',
      );
    }
  }

  async deleteUserByAdmin(id: string): Promise<{ success: boolean }> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new BadRequestException('사용자를 찾을 수 없습니다.');
      }
      return { success: true };
    } catch (error) {
      this.logger.error(`[deleteUserByAdmin] ${error.message}`, error.stack);
      throw new BadRequestException(
        '관리자에 의한 사용자 삭제 중 오류가 발생했습니다.',
      );
    }
  }

  async login(user: any) {
    try {
      if (!user || !user._id) {
        throw new BadRequestException('유효하지 않은 사용자 정보입니다.');
      }

      const payload = {
        email: user.email,
        sub: user._id.toString(),
        role: user.role,
      };

      await this.updateLastLogin(user._id);

      const accessToken = this.jwtService.sign(payload);

      return {
        success: true,
        access_token: accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
        message: '로그인에 성공했습니다.',
      };
    } catch (error) {
      this.logger.error(`[login] ${error.message}`, error.stack);
      throw new BadRequestException('로그인 처리 중 오류가 발생했습니다.');
    }
  }

  async register(
    registerDto: AdminUserCreateRequestDto,
    role: UserRole,
  ): Promise<any> {
    const { email, password, ...rest } = registerDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...rest,
      email,
      password: hashedPassword,
      role,
      isApproved: true,
    });

    const savedUser = await newUser.save();
    const result = savedUser.toObject();
    delete result.password;

    return result;
  }
}
