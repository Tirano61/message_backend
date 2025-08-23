import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialUsageService } from './material_usage.service';
import { CreateMaterialUsageDto } from './dto/create-material_usage.dto';
import { UpdateMaterialUsageDto } from './dto/update-material_usage.dto';

@Controller('material-usage')
export class MaterialUsageController {
  constructor(private readonly materialUsageService: MaterialUsageService) {}

  @Post()
  create(@Body() createMaterialUsageDto: CreateMaterialUsageDto) {
    return this.materialUsageService.create(createMaterialUsageDto);
  }

  @Get()
  findAll() {
    return this.materialUsageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialUsageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialUsageDto: UpdateMaterialUsageDto) {
    return this.materialUsageService.update(+id, updateMaterialUsageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialUsageService.remove(+id);
  }
}
