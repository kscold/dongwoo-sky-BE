import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleType } from './schema/vehicle-type.schema';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';

@Injectable()
export class VehicleTypeService {
  constructor(
    @InjectModel(VehicleType.name) private vehicleTypeModel: Model<VehicleType>,
  ) {}

  async create(
    createVehicleTypeDto: CreateVehicleTypeDto,
  ): Promise<VehicleType> {
    const created = new this.vehicleTypeModel(createVehicleTypeDto);
    return created.save();
  }

  async findAll(): Promise<VehicleType[]> {
    console.log('=== findAll 호출됨 ===');
    console.log('모델 이름:', this.vehicleTypeModel.collection.name);
    console.log('데이터베이스 이름:', this.vehicleTypeModel.db.name);

    // 전체 문서 수 확인
    const totalCount = await this.vehicleTypeModel.countDocuments().exec();
    console.log('전체 문서 수:', totalCount);

    // isActive: true 문서 수 확인
    const activeCount = await this.vehicleTypeModel
      .countDocuments({ isActive: true })
      .exec();
    console.log('isActive: true 문서 수:', activeCount);

    // 실제 쿼리 실행
    const result = await this.vehicleTypeModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();

    console.log('DB 조회 결과 개수:', result.length);
    console.log('첫 번째 결과:', result[0] || 'none');

    return result;
  }

  async findByType(type: 'ladder' | 'sky'): Promise<VehicleType[]> {
    return this.vehicleTypeModel
      .find({ type, isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();
  }

  async findAllAdmin(): Promise<VehicleType[]> {
    return this.vehicleTypeModel
      .find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();
  }

  async findOne(id: string): Promise<VehicleType> {
    return this.vehicleTypeModel.findById(id).exec();
  }

  async update(
    id: string,
    updateVehicleTypeDto: UpdateVehicleTypeDto,
  ): Promise<VehicleType> {
    return this.vehicleTypeModel
      .findByIdAndUpdate(id, updateVehicleTypeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<VehicleType> {
    return this.vehicleTypeModel.findByIdAndDelete(id).exec();
  }
}
