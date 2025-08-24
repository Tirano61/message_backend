import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSalesMaterialsAndPgvector1692800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.sales_materials (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id varchar(100) NOT NULL,
        material_type varchar(50) NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        file_url varchar(500) NOT NULL,
        thumbnail_url varchar(500),
        tags text[] DEFAULT '{}',
        text text,
        metadata jsonb DEFAULT '{}'::jsonb,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `);

    await queryRunner.query(`
      ALTER TABLE IF EXISTS public.sales_materials
      ADD COLUMN IF NOT EXISTS embedding vector(1536);
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE c.relname = 'idx_sales_materials_embedding'
        ) THEN
          CREATE INDEX idx_sales_materials_embedding
            ON public.sales_materials USING ivfflat (embedding vector_cosine_ops)
            WITH (lists = 100);
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS public.idx_sales_materials_embedding;`);
    await queryRunner.query(`ALTER TABLE IF EXISTS public.sales_materials DROP COLUMN IF EXISTS embedding;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.sales_materials;`);
  }
}