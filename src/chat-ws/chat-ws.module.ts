import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { MessageModule } from '../message/message.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MessageModule, PassportModule.register({ defaultStrategy: 'jwt' }), AuthModule],
  providers: [ChatWsGateway, ChatWsService],
})
export class ChatWsModule {}

