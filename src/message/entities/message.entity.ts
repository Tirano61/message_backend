
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation;

    @Column({ type: 'enum', enum: ['user', 'bot'] })
    sender: 'user' | 'bot';

    @Column('text')
    content: string;

    // Idempotency / external source id (por ejemplo id de n8n)
    @Column({ type: 'varchar', nullable: true, unique: true })
    external_id?: string;

    // session id que usa n8n en memoria
    @Column({ type: 'varchar', nullable: true })
    session_id?: string;

    // guardar el objeto completo que n8n usa (type, content, additional_kwargs, response_metadata...)
    @Column({ type: 'jsonb', nullable: true })
    n8n_message?: any;

    // campo libre para metadatos adicionales
    @Column({ type: 'jsonb', nullable: true })
    meta?: any;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}