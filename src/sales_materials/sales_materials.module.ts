import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesMaterial } from './entities/sales_material.entity';
import { SalesMaterialsController } from './sales_materials.controller';
import { SalesMaterialsService } from './sales_materials.service';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [TypeOrmModule.forFeature([SalesMaterial]), PassportModule.register({ defaultStrategy: 'jwt' }) ],
  controllers: [SalesMaterialsController],
  providers: [SalesMaterialsService],
  exports: [SalesMaterialsService],
})
export class SalesMaterialsModule {}