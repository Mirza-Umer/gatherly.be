import { Injectable } from '@nestjs/common';
import { CreateAiChatDto } from './dto/create-ai-chat.dto';
import { UpdateAiChatDto } from './dto/update-ai-chat.dto';
import axios from 'axios';
import {User} from "../users/entities/user.entity";

@Injectable()
export class AiChatService {
  async chat(user:User,message: string) {


    const response = await axios.post(
      process.env.AI_API_URL!,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(process.env.AI_API_KEY);

    return response.data.choices[0].message.content;
  }
}
