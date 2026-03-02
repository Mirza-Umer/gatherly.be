import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  followUser(@Param('id') id: number, @GetUser() currentUser: User) {
    return this.followService.follow(+id, currentUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/followers')
  getFollowers(@Param('id') id: number) {
    return this.followService.getFollowers(+id)
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/following')
  getFollowing(@Param('id') id: number) {
    return this.followService.getFollowing(+id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/unfollow')
  deleteFollow(@Param('id') id: number, @GetUser() currentUser: User) {
    return this.followService.unfollowUser(+id, currentUser);
  }

}
