import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,
  ) { }

  async follow(targetUserId: number, currentUser: User) {
    if (currentUser.id === targetUserId) {
      throw new BadRequestException("You can't follow yourself");
    }

    const existingFollow = await this.followRepo.findOne({
      where: {
        follower: { id: currentUser.id },
        following: { id: targetUserId },
      },
    });

    if (existingFollow) {
      throw new BadRequestException("You are already following this user");
    }

    return this.followRepo.save({
      follower: { id: currentUser.id },
      following: { id: targetUserId },
    });
  }

  async getFollowers(userId: number) {
    return this.followRepo.find({
      where: {
        following: { id: userId },
      },
      relations: ['follower',],
    });
  }

  async getFollowing(userId: number) {
    return this.followRepo.find({
      where: {
        follower: { id: userId },
      },
      relations: ['following'],
    })
  }


  async unfollowUser(targetUserId: number, currentUser: User) {
    if (currentUser.id === targetUserId) {
      throw new BadRequestException("You can't unfollow yourself");
    }

    const existingFollow = await this.followRepo.findOne({
      where: {
        follower: { id: currentUser.id },
        following: { id: targetUserId },
      },
    });

    if (!existingFollow) {
      throw new BadRequestException("You are not following this user");
    }

    return this.followRepo.delete({
      follower: { id: currentUser.id },
      following: { id: targetUserId },
    });
  }
}

