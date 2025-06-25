import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(
    private readonly chatWsService: ChatWsService
  ) {}
  handleConnection(client: Socket) {
    console.log('Cliene conectado', client.id)
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado.', client.id);
  }


}
