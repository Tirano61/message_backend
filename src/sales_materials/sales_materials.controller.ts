import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { SalesMaterialsService } from './sales_materials.service';
import { CreateSalesMaterialDto } from './dto/create-sales_material.dto';
import { UpdateSalesMaterialDto } from './dto/update-sales_material.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';


@Controller('sales-materials')
export class SalesMaterialsController {
  constructor(private readonly salesMaterialsService: SalesMaterialsService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.sales)
  create(@Body() createSalesMaterialDto: CreateSalesMaterialDto) {
    return this.salesMaterialsService.create(createSalesMaterialDto);
  }

  @Get()
  findAll(
    @Query('productId') productId?: string,
    @Query('materialType') materialType?: string,
  ) {
    if (productId) {
      return this.salesMaterialsService.findByProductId(productId);
    }
    if (materialType) {
      return this.salesMaterialsService.findByMaterialType(materialType);
    }
    return this.salesMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesMaterialsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalesMaterialDto: UpdateSalesMaterialDto,
  ) {
    return this.salesMaterialsService.update(id, updateSalesMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesMaterialsService.remove(id);
  }
}