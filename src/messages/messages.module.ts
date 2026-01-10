import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message,User]),],
  controllers: [MessagesController],
  providers: [MessagesService,MessagesGateway],
  exports:[MessagesGateway,MessagesService]
})
export class MessagesModule {}
