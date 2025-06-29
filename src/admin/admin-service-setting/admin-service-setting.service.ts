import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Service, ServiceDocument } from '../../schema/service.schema';

import { AdminServiceSettingCreateRequestDto } from './dto/request/admin-service-setting-create.request.dto';
import { AdminServiceSettingUpdateRequestDto } from './dto/request/admin-service-setting-update.request.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(
    createServiceDto: AdminServiceSettingCreateRequestDto,
  ): Promise<Service> {
    const createdService = new this.serviceModel(createServiceDto);
    return createdService.save();
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();
  }

  async findAllAdmin(): Promise<Service[]> {
    return this.serviceModel.find().sort({ sortOrder: 1, createdAt: 1 }).exec();
  }

  async findOne(id: string): Promise<Service> {
    return this.serviceModel.findById(id).exec();
  }

  async update(
    id: string,
    updateServiceDto: AdminServiceSettingUpdateRequestDto,
  ): Promise<Service> {
    return this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Service> {
    return this.serviceModel.findByIdAndDelete(id).exec();
  }
}
