import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService , private usersService: UsersService) {}

  @Post('chat')
  async chat(@Body('message') message: string, @GetUser() user: User) {

    const userFound = await this.usersService.getUserById(user.id);

    const systemPrompt =
      `
      You are an AI assistant inside a social media app.
Rules:
- Talk like a human friend
- Keep answers simple
- No emojis unless user uses them
- If unsure, ask a question
- User name is` +
      userFound?.firstName +
      ' ' +
      userFound?.lastName;

    console.log(userFound?.firstName, userFound?.lastName, systemPrompt, message);

    return {
      reply: await this.aiChatService.chat(user, systemPrompt+message),
    };
  }
  // @Get()
  // findAll() {
  //   return this.aiChatService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.aiChatService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAiChatDto: UpdateAiChatDto) {
  //   return this.aiChatService.update(+id, updateAiChatDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.aiChatService.remove(+id);
  // }
}
