import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRepo: Repository<FriendRequest>,
  ) {}

  async sendRequest(sender: User, receiverId: number) {
    if (sender.id === receiverId) {
      throw new BadRequestException('Cannot add yourself');
    }

    const existing = await this.friendRepo.findOne({
      where: [
        { sender: { id: sender.id }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: sender.id } },
      ],
    });

    if (existing) {
      throw new BadRequestException('Request already exists');
    }

    return this.friendRepo.save({
      sender,
      receiver: { id: receiverId },
    });
  }

  async acceptRequest(requestId: number, user: User) {
    console.log('requestId:', requestId);
    console.log('logged in user:', user);

    const request = await this.friendRepo.findOne({
      where: { id: requestId },
      relations: ['sender', 'receiver'],
    });

    console.log('db request:', request);

    if (!request || request.receiver.id !== user.id) {
      throw new NotFoundException('Not allowed');
    }

    request.status = 'accepted';
    return await this.friendRepo.save(request);
  }

  async rejectRequest(requestId: number, user: User) {
    const request = await this.friendRepo.findOne({
      where: { id: requestId },
      relations: ['sender', 'receiver'],
    });
    if (!request || request.receiver.id !== user.id) {
      throw new NotFoundException('Not allowed');
    }
    request.status = 'rejected';
    return this.friendRepo.remove(request);
  }

  async getFriends(user: User) {
    const friends = await this.friendRepo.find({
      where: [
        { sender: { id: user.id }, status: 'accepted' },
        { receiver: { id: user.id }, status: 'accepted' },
      ],
      relations: ['sender', 'receiver'],
    });

    return friends.map((request) => {
      return request.sender.id === user.id ? request.receiver : request.sender;
    });
  }

  async getFriendRequests(user: User) {
    const requests = await this.friendRepo.find({
      where: [
        { sender: { id: user.id }, },
        { receiver: { id: user.id }, },
      ],
      relations: ['sender', 'receiver'],
    });
    return requests;
  }

  // create(createFriendRequestDto: CreateFriendRequestDto) {
  //   return 'This action adds a new friendRequest';
  // }
  //
  // findAll() {
  //   return `This action returns all friendRequest`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} friendRequest`;
  // }
  //
  // update(id: number, updateFriendRequestDto: UpdateFriendRequestDto) {
  //   return `This action updates a #${id} friendRequest`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} friendRequest`;
  // }
}
