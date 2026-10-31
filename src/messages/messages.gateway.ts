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
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';
import { Message } from './entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const rawToken =
        client.handshake.auth?.token ||
        (client.handshake.headers?.authorization as string | undefined)?.replace('Bearer ', '');

      if (!rawToken) {
        console.warn(`[Socket] Disconnecting client ${client.id}: No token provided`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(rawToken);
      client.data.user = payload;
      const room = `user_${payload.id}`;
      client.join(room);
      console.log(`[Socket] Client ${client.id} joined ${room}`);
    } catch (err: any) {
      console.error(`[Socket] Auth failed for client ${client.id}:`, err?.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[Socket] Client ${client.id} disconnected`);
  }

  emitMessage(message: Message) {
    if (!message) return;
    const receiverRoom = `user_${message.receiver?.id}`;
    const senderRoom = `user_${message.sender?.id}`;

    this.server.to(receiverRoom).emit('newMessage', message);
    this.server.to(senderRoom).emit('newMessage', message);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { receiverId: number; message: string; senderId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.user?.id || data.senderId;
    if (!senderId || !data.receiverId || !data.message) {
      return;
    }

    const savedMessage = await this.messagesService.saveMessage(
      Number(senderId),
      Number(data.receiverId),
      data.message,
    );

    this.emitMessage(savedMessage);
    return savedMessage;
  }
}
