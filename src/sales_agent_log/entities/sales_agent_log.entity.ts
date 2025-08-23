import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sales_agent_log')
export class SalesAgentLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'vendor_id', length: 100 })
    vendorId: string;

    @Column('text')
    query: string;

    @Column({ name: 'materials_returned', default: 0 })
    materialsReturned: number;

    @Column({ name: 'response_summary', type: 'text', nullable: true })
    responseSummary: string;

    @Column({ name: 'response_time_ms', nullable: true })
    responseTimeMs: number;

    @Column({ default: true })
    success: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}