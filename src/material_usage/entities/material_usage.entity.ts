import { SalesMaterial } from 'src/sales_materials/entities/sales_material.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('material_usage')
export class MaterialUsage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'vendor_id', length: 100 })
    vendorId: string;

    @Column({ name: 'material_id', nullable: true })
    materialId: number;

    @ManyToOne(() => SalesMaterial, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'material_id' })
    material: SalesMaterial;

    @Column({ length: 50 })
    action: string;

    @Column('jsonb', { name: 'client_info', default: '{}' })
    clientInfo: Record<string, any>;

    @Column('text', { nullable: true })
    context: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}