import { User } from 'src/auth/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';
import { Category } from 'src/category/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.conversations)
    user: User;

    @ManyToOne(() => Category)
    category: Category;

    @Column()
    component: string;

    @Column({ default: 'open' })
    status: string;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}