import { User } from 'src/auth/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.conversations)
    user: User;

    @Column({ default: 'open' })
    status: string;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}