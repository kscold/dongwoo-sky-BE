import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from './schemas/equipment.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = new this.equipmentModel(createEquipmentDto);
    return equipment.save();
  }

  async findAll(): Promise<Equipment[]> {
    console.log('findAll 호출됨');
    const result = await this.equipmentModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();
    console.log('DB 조회 결과:', result);
    return result;
  }

  async findAllAdmin(): Promise<Equipment[]> {
    return this.equipmentModel
      .find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentModel.findById(id).exec();
    if (!equipment) {
      throw new NotFoundException('장비를 찾을 수 없습니다.');
    }
    return equipment;
  }

  async update(
    id: string,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    const equipment = await this.equipmentModel
      .findByIdAndUpdate(id, updateEquipmentDto, { new: true })
      .exec();

    if (!equipment) {
      throw new NotFoundException('장비를 찾을 수 없습니다.');
    }
    return equipment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.equipmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('장비를 찾을 수 없습니다.');
    }
  }

  async updateSortOrder(equipmentIds: string[]): Promise<void> {
    const updatePromises = equipmentIds.map((id, index) =>
      this.equipmentModel.findByIdAndUpdate(id, { sortOrder: index }).exec(),
    );
    await Promise.all(updatePromises);
  }
}
