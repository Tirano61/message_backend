import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/create-category.dto';
import { Component } from 'src/component/entities/component.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}

  async create(categoryDto: CategoryDto) {
    // Mapear los nombres de componentes a entidades Component
    let components: Component[] = [];
    if (categoryDto.components && categoryDto.components.length > 0) {
      components = await this.componentRepository.findBy(categoryDto.components);
    }

    const category = this.categoryRepository.create({
      ...categoryDto,
      components,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(user: User) {
    try {
      const categories = await this.categoryRepository.find({ relations: ['components'] });

      // Si el usuario es tecnico o admin, devuelve todas las categorías
      if (user.roles.includes('admin') || user.roles.includes('tecnico')) {
        return categories;
      }

      // Si solo es user, devuelve solo las categorías de tipo 'user'
      const filtered = categories.filter(category => category.type === 'user');
      return filtered;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  findOne(id: string) {
    return this.categoryRepository.findOneBy({ id });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }
}

