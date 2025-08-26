import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketEmitterService {
	private server: Server | null = null;

	setServer(server: Server) {
		this.server = server;
	}

	emitToConversation(conversationId: string, event: string, payload: any) {
		this.server?.to(conversationId).emit(event, payload);
	}

	emitToSocket(socketId: string, event: string, payload: any) {
		console.log({ payload });
		this.server?.to(socketId).emit(event, payload);
	}
}
