import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalesMaterial } from './entities/sales_material.entity';
import { CreateSalesMaterialDto } from './dto/create-sales_material.dto';
import { UpdateSalesMaterialDto } from './dto/update-sales_material.dto';
import { JsonToTextTransformer } from './utils/data_transform';
import { OpenAiService } from './utils/openai_service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgvector = require('pgvector');


@Injectable()
export class SalesMaterialsService {
	constructor(
		@InjectRepository(SalesMaterial)
		private salesMaterialsRepository: Repository<SalesMaterial>,
		private readonly dataSource: DataSource,
		private readonly openAiService: OpenAiService,
	) { }

	// Unificado: crea registro, genera embedding (vía OpenAiService) y guarda vector en la columna `embedding` (pgvector)
	async create(createSalesMaterialDto: CreateSalesMaterialDto): Promise<SalesMaterial> {

		// 1) convertir JSON a texto y crear metadata ANTES de persistir
		const embeddingText = JsonToTextTransformer.toEmbeddingText(createSalesMaterialDto as Record<string, any>);
		const metadata = JsonToTextTransformer.createMetadata(createSalesMaterialDto as Record<string, any>);

		// 2) guardar registro incluyendo metadata y guardar el texto de embedding en la columna `text`
		const salesMaterial = this.salesMaterialsRepository.create({
			...createSalesMaterialDto,
			metadata,
			text: embeddingText, // <-- aquí se guarda embeddingText en la columna `text`
		});
		const saved = await this.salesMaterialsRepository.save(salesMaterial);

		// 4) obtener embedding usando el servicio separado
		const embedding = await this.openAiService.getEmbedding(embeddingText);

		// 5) validar dimensión opcional
		const expectedDim = process.env.EXPECT_EMBEDDING_DIM ? parseInt(process.env.EXPECT_EMBEDDING_DIM, 10) : undefined;
		if (expectedDim && embedding.length !== expectedDim) {
			throw new Error(`Embedding length ${embedding.length} != expected ${expectedDim}`);
		}

		// 6) sanitizar y actualizar la columna pgvector `embedding` de forma parametrizada (seguro)
		const sanitized = embedding.map((n, i) => {
			if (typeof n !== 'number' || !Number.isFinite(n)) {
				throw new Error(`Invalid embedding value at index ${i}`);
			}
			return Number(n);
		});
		const vectorLiteral = `[${sanitized.join(',')}]`; // será pasado como parámetro
		await this.dataSource.query(
			`UPDATE sales_materials SET embedding = $1::vector WHERE id = $2`,
			[vectorLiteral, saved.id],
		);

		return saved;
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