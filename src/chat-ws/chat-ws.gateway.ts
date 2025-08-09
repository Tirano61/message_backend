import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { MessageService } from '../message/message.service';
import { Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadInterface } from 'src/auth/interfaces/jwt-payload.interface';


@WebSocketGateway({ cors: true })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(
    private readonly chatWsService: ChatWsService,
    private readonly messageService: MessageService,
    private readonly swtService: JwtService,

  ) {}
  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let header: JWTPayloadInterface;
    try {
      header = this.swtService.verify( token );

    } catch (error) {
      client.disconnect();
      console.error('Error al conectar el cliente:', error);
      return;
    }
    console.log('Cliente conectado', {header} );
    this.chatWsService.registerClient(client);
  }
  
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado.', client.id);
    this.chatWsService.removeClient( client.id );
  }

  @SubscribeMessage('client-send-message')
  async handleClientSendMessage(client: Socket, payload: SendMessageDto) {
    const token = client.handshake.headers.authentication as string;
    let header: JWTPayloadInterface;
    try {
      header = this.swtService.verify( token );
      console.log('Mensaje recibido',header, payload);
    
      // Crear el mensaje en la base de datos
      const newMessage = await this.messageService.create({
        conversationId: payload.conversationId,
        sender: 'user',
        content: payload.content,
      });
      console.log({newMessage});
      
      // También emitir de vuelta al cliente que envió el mensaje para confirmación
      client.emit('message-saved', newMessage);

      return newMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      client.emit('error', { message: 'Token inválido o expirado' });
    }

  }  
}
