import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { MessageModule } from '../message/message.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { SocketEmitterService } from 'src/shared/socket-emitter.service';

@Module({
	imports: [MessageModule, PassportModule.register({ defaultStrategy: 'jwt' }), AuthModule, ConversationModule],
	providers: [ChatWsGateway, ChatWsService, SocketEmitterService],
	exports: [SocketEmitterService],
})
export class ChatWsModule { }

