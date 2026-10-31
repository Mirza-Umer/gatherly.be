import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { MessagesGateway } from './messages.gateway';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Post('send-message')
  async sendMessage(@GetUser() user: User, @Body() dto: CreateMessageDto) {
    const savedMessage = await this.messagesService.sendMessage(user.id, dto);
    this.messagesGateway.emitMessage(savedMessage);
    return savedMessage;
  }

  @Get(':receiverId')
  getMessages(
    @GetUser() user: User,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ) {
    return this.messagesService.getMessages(user.id, receiverId);
  }
}
