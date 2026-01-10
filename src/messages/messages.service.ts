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

  async sendMessage(senderId: number, dto: CreateMessageDto) {
    const sender = await this.userRepo.findOneBy({ id: senderId });
    if (!sender) throw new NotFoundException('Sender not found');

    const receiver = await this.userRepo.findOneBy({ id: dto.receiverId });
    if (!receiver) throw new NotFoundException('Receiver not found');

    const message = this.messageRepo.create({
      message: dto.message,
      sender,
      receiver,
    });

    const savedMessage = await this.messageRepo.save(message);

    return savedMessage;
  }

  getMessages(senderId: number, receiverId: number) {
    return this.messageRepo.find({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
  }

  async saveMessage(senderId: number, receiverId: number, message: string) {
    const msg = this.messageRepo.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      message,
    });

    return this.messageRepo.save(msg);
  }

  // findAll() {
  //   return `This action returns all messages`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }
  //
  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
