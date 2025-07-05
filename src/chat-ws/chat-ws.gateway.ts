import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { MessageService } from '../message/message.service';
import { Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: true })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(
    private readonly chatWsService: ChatWsService,
    private readonly messageService: MessageService,
  ) {}
  handleConnection(client: Socket) {
    console.log('Cliene conectado', client.id)
    this.chatWsService.registerClient(client);
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado.', client.id);
    this.chatWsService.removeClient( client.id );
  }

  @SubscribeMessage('client-send-message')
  async handleClientSendMessage(client: Socket, payload: SendMessageDto) {
    try {
      console.log('Mensaje recibido',payload);
      // Crear el mensaje en la base de datos
      const newMessage = await this.messageService.create({
        conversationId: payload.conversationId,
        sender: 'user',
        content: payload.content,
        type: payload.type || 'text',
      });
      console.log({newMessage});
      
      // También emitir de vuelta al cliente que envió el mensaje para confirmación
      client.emit('message-saved', newMessage);

      return newMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      client.emit('error', { message: 'Error al guardar el mensaje' });
    }
  }


}
