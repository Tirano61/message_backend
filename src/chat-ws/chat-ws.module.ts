import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { MessageModule } from '../message/message.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [MessageModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [ChatWsGateway, ChatWsService],
})
export class ChatWsModule {}

