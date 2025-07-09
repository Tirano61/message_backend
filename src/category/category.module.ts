import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ComponentModule } from 'src/component/component.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [ TypeOrmModule.forFeature([Category]), ComponentModule, PassportModule.register({ defaultStrategy: 'jwt' }) ],
  exports: [ TypeOrmModule, CategoryService,  ],
})
export class CategoryModule {}

