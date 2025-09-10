import { User } from 'src/auth/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, RelationId } from 'typeorm';


@Entity()
export class Conversation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, user => user.conversations, { nullable: true })
	@JoinColumn({ name: 'user_id' })
	user?: User;

	@RelationId((conversation: Conversation) => conversation.user)
	user_id?: string;

	@Column({ nullable: true })
	title: string;

	@OneToMany(() => Message, message => message.conversation)
	messages: Message[];

	@Column({ nullable: true, unique: true })
	session_token: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created_at: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updated_at: Date;

	@Column({ type: 'enum', enum: ['sales', 'tecnico', 'anonimo'], default: 'anonimo' })
	type: string;

}