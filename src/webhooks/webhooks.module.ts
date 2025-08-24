import { Module } from '@nestjs/common';
import { N8nWebhooksController } from './n8n.controller';
import { MessageModule } from 'src/message/message.module';
import { ChatWsModule } from 'src/chat-ws/chat-ws.module';

@Module({
	imports: [MessageModule, ChatWsModule],
	controllers: [N8nWebhooksController],
})
export class WebhooksModule { }
