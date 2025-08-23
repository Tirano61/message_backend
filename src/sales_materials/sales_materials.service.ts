import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesMaterial } from './entities/sales_material.entity';
import { CreateSalesMaterialDto } from './dto/create-sales_material.dto';
import { UpdateSalesMaterialDto } from './dto/update-sales_material.dto';
import { StringifyOptions } from 'querystring';


@Injectable()
export class SalesMaterialsService {
  constructor(
    @InjectRepository(SalesMaterial)
    private salesMaterialsRepository: Repository<SalesMaterial>,
  ) {}

  async create(createSalesMaterialDto: CreateSalesMaterialDto): Promise<SalesMaterial> {
    const salesMaterial = this.salesMaterialsRepository.create(createSalesMaterialDto);
    return await this.salesMaterialsRepository.save(salesMaterial);
  }

  async findAll(): Promise<SalesMaterial[]> {
    return await this.salesMaterialsRepository.find();
  }

  async findOne(id: string): Promise<SalesMaterial> {
    const salesMaterial = await this.salesMaterialsRepository.findOne({ where: { id } });
    if (!salesMaterial) {
      throw new Error(`SalesMaterial with id ${id} not found`);
    }
    return salesMaterial;
  }

  async findByProductId(productId: string): Promise<SalesMaterial[]> {
    return await this.salesMaterialsRepository.find({ where: { productId } });
  }

  async findByMaterialType(materialType: string): Promise<SalesMaterial[]> {
    return await this.salesMaterialsRepository.find({ where: { materialType } });
  }

  async update(id: string, updateSalesMaterialDto: UpdateSalesMaterialDto): Promise<SalesMaterial> {
    await this.salesMaterialsRepository.update(id, updateSalesMaterialDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.salesMaterialsRepository.delete(id);
  }
}