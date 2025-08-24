import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { MessageService } from '../message/message.service';
import { Socket, Server } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadInterface } from 'src/auth/interfaces/jwt-payload.interface';
import { ConversationService } from 'src/conversation/conversation.service';
import { SocketEmitterService } from 'src/shared/socket-emitter.service';


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
		const token = client.handshake.headers.authentication as string | undefined;

		if (token) {
			try {
				const header = this.swtService.verify(token) as JWTPayloadInterface;
				client.data.user = header; // attach user info
				this.chatWsService.registerClient(client);
				return;
			} catch (err) {
				// token inválido -> tratar como anónimo a continuación
				console.warn('Token inválido en conexión, intentar tratar como anónimo', client.id);
			}
		}

		// cliente anónimo: requerir conversationId + session_token en handshake.auth (o headers)
		const auth = (client.handshake as any).auth || {};
		const conversationId = auth.conversationId || (client.handshake.headers['conversationid'] as string) || (client.handshake.headers['conversation-id'] as string);
		const sessionToken = auth.session_token || auth.sessionToken || (client.handshake.headers['session_token'] as string) || (client.handshake.headers['session-token'] as string);

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

	@SubscribeMessage('client-send-message')
	async handleClientSendMessage(client: Socket, payload: SendMessageDto) {
		// Determine authenticated user or anonymous context
		const header = client.data?.user as JWTPayloadInterface | null;
		let convo;
		if (header) {
			// authenticated flow
			convo = await this.conversationService.findOneById(payload.conversationId);
			if (!convo) {
				client.emit('error', { message: 'Conversation not found' });
				return;
			}
		} else {
			// anonymous flow - prefer conversationId from client.data (set at connect)
			const convId = client.data?.conversationId ?? payload.conversationId;
			const sessionToken = client.data?.session_token ?? payload.session_token;
			convo = await this.conversationService.findOneById(convId);
			if (!convo || !sessionToken || convo.session_token !== sessionToken) {
				client.emit('error', { message: 'Invalid conversation or session token' });
				return;
			}
			// ensure payload uses the correct conversation id
			payload.conversationId = convId;
		}

		// create message
		const newMessage = await this.messageService.create({
			conversationId: payload.conversationId,
			sender: 'user',
			content: payload.content,
		});

		client.emit('message-saved', newMessage);

		// send to n8n asynchronously
		const n8nUrl = process.env.N8N_WEBHOOK_URL
		const body = {
			messageId: newMessage.id,
			conversationId: payload.conversationId,
			socketId: client.id,
			session_token: payload.session_token,
			content: newMessage.content,
			sender: 'user',
		};

		try {
			fetch(n8nUrl!, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}).then(res => console.log('n8n notified', { messageId: newMessage.id, status: res.status })).catch(err => console.error('n8n notify error', err));
		} catch (err) {
			console.error('n8n notify error', err);
		}

		return newMessage;

	}

	@SubscribeMessage('client-send-user')
	async handleClientSendUser(client: Socket, payload: SendMessageDto) {
		// deprecated: use 'client-send-message' which supports anonymous and authenticated flows
		return this.handleClientSendMessage(client, payload);
	}

	@SubscribeMessage('client-send-tecnico')
	async handleClientSendTecnico(client: Socket, payload: SendMessageDto) {
		const header = client.data.user as JWTPayloadInterface | null;
		if (!header) {
			client.emit('error', { message: 'Authentication required' });
			return;
		}
		// adicional: comprobar role en header.roles
	}
}
