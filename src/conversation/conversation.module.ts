import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from './entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
	controllers: [ConversationController],
	providers: [ConversationService],
	imports: [TypeOrmModule.forFeature([Conversation]), PassportModule.register({ defaultStrategy: 'jwt' })],
	exports: [TypeOrmModule, ConversationService]
})
export class ConversationModule { }

