import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Conversation, Message]),
	],
	controllers: [ConversationController],
	providers: [ConversationService],
	exports: [ConversationService],
})
export class ConversationModule { }

