import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { User } from 'src/auth/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ ConversationController],
  providers: [ ConversationService],
  imports: [ TypeOrmModule.forFeature([Conversation]), PassportModule.register({ defaultStrategy: 'jwt' }) ],
  exports: [ TypeOrmModule ]
})
export class ConversationModule {}

