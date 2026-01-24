import { MessagesService } from './messages.service';

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private messagesService: MessagesService) {
    }

  private connectedUsers = new Map<number, string>();

  handleConnection(client: Socket) {
    console.log('GATEWAY CONNECTED:', client.id);

    const token = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log('DISCONNECTED:', client.id);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Message received:', data);

    // const { receiverId } = data;
    const savedMessage =  this.messagesService.saveMessage(
      data.senderId,
      data.receiverId,
      data.message,
    );

    // TEMP: send to ALL clients except sender (works for now)
    client.broadcast.emit('newMessage', savedMessage );
  }

  // emitMessage(socketId: string, data: any) {
  //   this.server.to(socketId).emit('newMessage', data);
  // }
}
