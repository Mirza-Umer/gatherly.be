import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send-message')
  sendMessage(@GetUser() user: User, @Body() dto: CreateMessageDto) {
    console.log(user.id);
    return this.messagesService.sendMessage(user.id, dto);
  }
  @Get(':userId')
  getMessages(@GetUser() user: User,@Param('receiverId') receiverId: number) {
    return this.messagesService.getMessages(user.id, receiverId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messagesService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(+id, updateMessageDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.messagesService.remove(+id);
  // }
}
