import { Component } from 'src/component/entities/component.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string; // Ej: "Laptops", "Smartphones", "Impresoras"

    @OneToMany(() => Component, component => component.category, { cascade: true })
    components: Component[];

    @Column({ nullable: true })
    description?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 'user' })
    type: 'user' | 'tecnico'; // 'final' para usuarios finales, 'tecnico' para técnicos
}