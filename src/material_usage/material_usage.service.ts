import { Injectable } from '@nestjs/common';
import { CreateMaterialUsageDto } from './dto/create-material_usage.dto';
import { UpdateMaterialUsageDto } from './dto/update-material_usage.dto';

@Injectable()
export class MaterialUsageService {
  create(createMaterialUsageDto: CreateMaterialUsageDto) {
    return 'This action adds a new materialUsage';
  }

  findAll() {
    return `This action returns all materialUsage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialUsage`;
  }

  update(id: number, updateMaterialUsageDto: UpdateMaterialUsageDto) {
    return `This action updates a #${id} materialUsage`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialUsage`;
  }
}
