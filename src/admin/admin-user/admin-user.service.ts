import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '../../schema/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AdminLoginDto } from './dto/request/admin-login.dto';
import { AdminLoginResponseDto } from './dto/response/admin-login-response.dto';
import { AdminUserListResponseDto } from './dto/response/admin-user-list-response.dto';
import { AdminApproveUserDto } from './dto/request/admin-approve-user.dto';

@Injectable()
export class AdminUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.CUSTOMER,
    });

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    // 권한 변경 시 승인 여부도 같이 처리 가능
    if (updateUserDto.role && updateUserDto.role === UserRole.WORKER) {
      updateUserDto.isApproved = true;
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { lastLoginAt: new Date() })
      .exec();
  }
  // --- AdminUser API 확장 ---
  async login(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const user = await this.userModel.findOne({
      email: dto.email,
      role: UserRole.ADMIN,
    });
    if (!user) throw new UnauthorizedException('관리자 계정이 아닙니다.');
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    if (!user.isApproved)
      throw new UnauthorizedException('승인되지 않은 계정입니다.');
    // TODO: JWT 발급 로직 연결
    return { accessToken: 'mock-token', expiresIn: 3600 };
  }

  async getUserList(): Promise<AdminUserListResponseDto> {
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
  }

  async approveUser(dto: AdminApproveUserDto): Promise<{ success: boolean }> {
    const user = await this.userModel.findById(dto.userId);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    user.isApproved = true;
    await user.save();
    return { success: true };
  }
}
