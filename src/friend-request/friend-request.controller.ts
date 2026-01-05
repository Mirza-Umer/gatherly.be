import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post('request/:receiverId')
  sendRequest(@Req() req,  @Param('receiverId') receiverId: number) {
    return this.friendRequestService.sendRequest(req.user, +receiverId);
  }

  @Patch('accept/:requestId')
  acceptRequest(@Param('requestId') requestId: number, @GetUser() user: User) {
    return this.friendRequestService.acceptRequest(+requestId, user);
  }
  @Get('friends')
  getFriends(@GetUser() user: User) {
    return this.friendRequestService.getFriends(user);
  }

  @Patch('reject/:requestId')
  rejectRequest(@Param('requestId') requestId: number, @GetUser() user: User) {
    return this.friendRequestService.rejectRequest(+requestId, user);
  }

  @Get('requests')
  getFriendRequests(@GetUser() user: User) {
    return this.friendRequestService.getFriendRequests(user);
  }

  // @Post()
  // create(@Body() createFriendRequestDto: CreateFriendRequestDto) {
  //   return this.friendRequestService.create(createFriendRequestDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.friendRequestService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendRequestService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendRequestDto: UpdateFriendRequestDto) {
  //   return this.friendRequestService.update(+id, updateFriendRequestDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendRequestService.remove(+id);
  // }
}
