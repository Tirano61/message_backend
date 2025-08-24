import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesMaterialsService } from './sales_materials.service';
import { SalesMaterialsController } from './sales_materials.controller';
import { SalesMaterial } from './entities/sales_material.entity';
import { OpenAiService } from './utils/openai_service';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [TypeOrmModule.forFeature([SalesMaterial]), PassportModule.register({ defaultStrategy: 'jwt' })],
	controllers: [SalesMaterialsController],
	providers: [
		SalesMaterialsService,
		OpenAiService,
	],
	exports: [SalesMaterialsService],
})
export class SalesMaterialsModule { }