import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { MessageService } from '../message/message.service';
import { Socket, Server } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadInterface } from 'src/auth/interfaces/jwt-payload.interface';
import { ConversationService } from 'src/conversation/conversation.service';
import { SocketEmitterService } from 'src/shared/socket-emitter.service';

export enum Sender {
	User = 'user',
	Bot = 'bot',
	Tecnico = 'tecnico',
	Sales = 'sales'
}

@WebSocketGateway({ cors: true })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer() server: Server;

	constructor(
		private readonly chatWsService: ChatWsService,
		private readonly messageService: MessageService,
		private readonly swtService: JwtService,

		private readonly conversationService: ConversationService,
		private readonly socketEmitter: SocketEmitterService,

	) { }

	afterInit(server: Server) {
		this.socketEmitter.setServer(server);
		console.log('SocketEmitterService initialized with server');
	}
	async handleConnection(client: Socket) {
		const auth = (client.handshake as any).auth || {};
		const token = auth.token as string | undefined;

		if (token) {
			try {
				const header = this.swtService.verify(token) as JWTPayloadInterface;
				// attach user info (incluye roles). Normalizar roles a array de strings en client.data.roles
				client.data.user = header;
				if (header && (header as any).roles) {
					const raw = (header as any).roles;
					client.data.roles = Array.isArray(raw) ? raw.map(String) : [String(raw)];
				} else {
					client.data.roles = [];
					console.warn('User token has no roles claim', client.id);
				}
				this.chatWsService.registerClient(client);
				return;
			} catch (err) {
				// token inválido -> tratar como anónimo a continuación
				console.warn('Token inválido en conexión, intentar tratar como anónimo', client.id);
			}
		}

		// cliente anónimo: requerir conversationId + session_token sólo en handshake.auth
		const conversationId = auth.conversationId as string | undefined;
		const sessionToken = auth.session_token as string | undefined || auth.sessionToken as string | undefined;

		if (!conversationId || !sessionToken) {
			console.warn('Anon client missing conversationId or session_token - disconnecting', client.id);
			client.disconnect();
			return;
		}

		try {
			const convo = await this.conversationService.findOneById(conversationId);
			if (!convo || convo.session_token !== sessionToken) {
				console.warn('Anon client provided invalid session token for conversation - disconnecting', client.id, { conversationId });
				client.disconnect();
				return;
			}

			// valid anonymous client
			client.data.user = null;
			client.data.conversationId = conversationId;
			client.data.session_token = sessionToken;
			this.chatWsService.registerClient(client);
		} catch (err) {
			console.error('Error validating anonymous client handshake', err);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		console.log('Cliente desconectado.', client.id);
		this.chatWsService.removeClient(client.id);
	}

	private async processSendMessage(client: Socket, payload: SendMessageDto, sender: Sender) {
		const header = client.data?.user as JWTPayloadInterface | null;
		let convId: string | undefined = payload.conversationId;
		let sessionToken: string | undefined = payload.session_token;
		console.log({ payload });
		//console.log({ client });
		if (!header) {
			// anonymous: prefer values from client.data (set at connect)
			convId = client.data?.conversationId ?? payload.conversationId;
			sessionToken = client.data?.session_token ?? payload.session_token;
		}

		if (!convId) {
			client.emit('error', { message: 'Conversation id required' });
			return;
		}

		const convo = await this.conversationService.findOneById(convId);
		if (!convo) {
			client.emit('error', { message: 'Conversation not found' });
			return;
		}

		if (!header) {
			if (!sessionToken || convo.session_token !== sessionToken) {
				client.emit('error', { message: 'Invalid conversation or session token' });
				return;
			}
		}

		// create message
		const newMessage = await this.messageService.create({
			conversationId: convId,
			sender: sender === Sender.User ? 'user' : 'bot',
			content: payload.content,
		});

		client.emit('message-saved', newMessage);

		// send to n8n asynchronously
		const n8nUrl = process.env.N8N_WEBHOOK_URL;
		const body: any = {
			messageId: newMessage.id,
			conversationId: convId,
			socketId: client.id,
			content: newMessage.content,
			sender,
		};
		if (!header) body.session_token = sessionToken;

		try {
			if (n8nUrl) {
				fetch(n8nUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				}).then(res => console.log('n8n notified', { messageId: newMessage.id, status: res.status })).catch(err => console.error('n8n notify error', err));
			}
		} catch (err) {
			console.error('n8n notify error', err);
		}

		return newMessage;
	}

	@SubscribeMessage('client-send-message')
	async handleClientSendMessage(client: Socket, payload: SendMessageDto) {
		return this.processSendMessage(client, payload, Sender.User);

	}

	@SubscribeMessage('client-send-user')
	async handleClientSendUser(client: Socket, payload: SendMessageDto) {
		// anonymous users
		const header = client.data?.user as JWTPayloadInterface | null;
		if (header) {
			client.emit('error', { message: 'Use tecnico/sales events for authenticated users' });
			return;
		}
		return this.processSendMessage(client, payload, Sender.User);
	}

	@SubscribeMessage('client-send-tecnico')
	async handleClientSendTecnico(client: Socket, payload: SendMessageDto) {
		const header = client.data.user as JWTPayloadInterface | null;
		if (!header) {
			client.emit('error', { message: 'Authentication required' });
			return;
		}
		// verificar role de tecnico
		const rolesTec: string[] = client.data?.roles ?? [];
		if (!rolesTec.includes('tecnico')) {
			client.emit('error', { message: 'Insufficient role: tecnico required' });
			return;
		}
		return this.processSendMessage(client, payload, Sender.Tecnico);
	}

	@SubscribeMessage('client-send-sales')
	async handleClientSendSales(client: Socket, payload: SendMessageDto) {
		const header = client.data.user as JWTPayloadInterface | null;
		if (!header) {
			client.emit('error', { message: 'Authentication required' });
			return;
		}
		// verificar role de sales
		const rolesSales: string[] = client.data?.roles ?? [];
		if (!rolesSales.includes('sales')) {
			client.emit('error', { message: 'Insufficient role: sales required' });
			return;
		}
		return this.processSendMessage(client, payload, Sender.Sales);
	}
}
