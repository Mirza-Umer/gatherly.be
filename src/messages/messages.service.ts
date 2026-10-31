import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async saveMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    const sender = await this.userRepo.findOne({
      where: { id: senderId },
      select: ['id', 'firstName', 'lastName', 'profilePhoto'],
    });
    if (!sender) throw new NotFoundException('Sender not found');

    const receiver = await this.userRepo.findOne({
      where: { id: receiverId },
      select: ['id', 'firstName', 'lastName', 'profilePhoto'],
    });
    if (!receiver) throw new NotFoundException('Receiver not found');

    const message = this.messageRepo.create({
      message: content,
      sender,
      receiver,
    });

    return this.messageRepo.save(message);
  }

  sendMessage(senderId: number, dto: CreateMessageDto): Promise<Message> {
    return this.saveMessage(senderId, dto.receiverId, dto.message);
  }

  getMessages(senderId: number, receiverId: number): Promise<Message[]> {
    return this.messageRepo.find({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
  }
}
