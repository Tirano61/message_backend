import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create_user.dto';

@Injectable()
export class ConversationService {
	constructor(
		@InjectRepository(Conversation)
		private readonly conversationRepository: Repository<Conversation>,
	) { }

	create(createConversationDto: CreateConversationDto) {
		// Defensive: allow missing body to avoid runtime destructuring error
		const { user, title } = createConversationDto ?? {} as Partial<CreateConversationDto>;
		const sessionToken = randomUUID();
		const payload: any = {
			title: title || 'title',
			session_token: sessionToken,
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

	remove(id: string) {
		return `This action removes a #${id} conversation`;
	}
}
