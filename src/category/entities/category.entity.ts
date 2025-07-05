import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Ej: "Laptops", "Smartphones", "Impresoras"

    @Column({ nullable: true })
    description?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 'user' })
    type: 'user' | 'tecnico'; // 'final' para usuarios finales, 'tecnico' para técnicos
}