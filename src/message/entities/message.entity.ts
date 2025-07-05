
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation;

    @Column({ type: 'enum', enum: ['user', 'system'] })
    sender: 'user' | 'system';

    @Column('text')
    content: string;

    @Column({ default: 'text' })
    type: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}