import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity('sales_materials')
export class SalesMaterial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'product_id', length: 100 })
    productId: string;

    @Column({ name: 'material_type', length: 50 })
    materialType: string;

    @Column({ length: 255 })
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ name: 'file_url', length: 500 })
    fileUrl: string;

    @Column({ name: 'thumbnail_url', length: 500, nullable: true })
    thumbnailUrl: string;

    @Column('text', { array: true, default: '{}' })
    tags: string[];

    @Column('text')
    text: string;

    @Column('jsonb', { default: '{}' })
    metadata: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}