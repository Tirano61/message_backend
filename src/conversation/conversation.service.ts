import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create_user.dto';
import { Message } from 'src/message/entities/message.entity'; // added

@Injectable()
export class ConversationService {
	constructor(
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,

		@InjectRepository(Message) // added
		private readonly messageRepository: Repository<Message>,
	) { }

	create(createConversationDto: CreateConversationDto) {
		// Defensive: allow missing body to avoid runtime destructuring error
		const { user, title, type } = createConversationDto ?? {} as Partial<CreateConversationDto>;
		const sessionToken = randomUUID();
		const payload: any = {
			title: title || 'title',
			session_token: sessionToken,
			type: type
		};

		if (user) payload.user = { id: user };

		const conversation = this.conversationRepository.create(payload);
		return this.conversationRepository.save(conversation);
	}

	findAll() {
		return this.conversationRepository.find();
	}

	findOne(id: string) {
		return `This action returns a #${id} conversation`;
	}

	async findOneById(id: string) {
		return this.conversationRepository.findOne({ where: { id } });
	}

	update(id: string, updateConversationDto: UpdateConversationDto) {
		return `This action updates a #${id} conversation`;
	}

	async remove(id: string) {
		const convo = await this.conversationRepository.findOne({ where: { id } });
		if (!convo) {
			throw new NotFoundException(`Conversation with id ${id} not found`);
		}

		// eliminar mensajes asociados primero para evitar violación FK
		try {
			await this.messageRepository.createQueryBuilder()
				.delete()
				.where('"conversationId" = :id', { id })
				.execute();
		} catch (err) {
			// fallback: intentar eliminar por relación si la columna tiene otro nombre
			console.warn('Warning deleting messages by conversationId, trying relation-based remove', err);
			await this.messageRepository.delete({ conversation: convo as any });
		}

		await this.conversationRepository.remove(convo);
		console.log(`Conversation with id ${id} removed`);
		return { success: true, id };
	}

}
