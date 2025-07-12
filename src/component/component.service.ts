
import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Repository } from 'typeorm';
import { Component } from './entities/component.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Injectable()
export class ComponentService {

  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}


  async create(createComponentDto: CreateComponentDto) {
    // Buscar la categoría por ID y asignarla
    const { categoryId, ...rest } = createComponentDto;
    const category = await this.componentRepository.manager.findOne(Category, { where: { id: categoryId } });
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    const component = this.componentRepository.create({ ...rest, category });
  
    return this.componentRepository.save(component);
  }

  async findAll() {
    const components = await this.componentRepository.find({ relations: ['category'] });
    return components.map(component => ({
      ...component,
      categoryId: component.category?.id ?? null,
    }));
  }

  async findOne(id: string) {
    const component = await this.componentRepository.findOne( { where: { id }, relations: ['category'] });
    if (!component) throw new Error('Componente no encontrado');
    return {
      ...component,
      categoryId: component.category?.id ?? null,
    };
  }

  async update(id: string, updateComponentDto: UpdateComponentDto) {
    const { categoryId, ...rest } = updateComponentDto;
    return this.componentRepository.update(id, {  ...rest, category: { id: categoryId } });
  }

  async remove(id: string) {
    return this.componentRepository.delete(id);
  }
}
