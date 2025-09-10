import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { SocketEmitterService } from 'src/shared/socket-emitter.service';
import { N8nWebhookDto } from './dto/n8n-webhook.dto';

@Controller('webhooks')
export class N8nWebhooksController {
	constructor(
		private readonly messageService: MessageService,
		private readonly socketEmitter: SocketEmitterService,
	) { }

	@Post('n8n')
	async handleN8n(@Body() body: N8nWebhookDto) {
		const { conversationId, content, sender, socketId } = body;

		const saved = await this.messageService.create({
			conversationId,
			content,
			sender: (sender ?? 'bot') as 'user' | 'bot',
		});

		// Emit to conversation room
		//this.socketEmitter.emitToConversation(conversationId, 'message', saved);

		// Also emit directly to socketId if provided
		if (socketId) this.socketEmitter.emitToSocket(socketId, 'message', saved);

		return { ok: true, saved };
	}
}

