import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Follow } from './entities/follow.entity';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [TypeOrmModule.forFeature([User, Follow])],
})
export class FollowModule {}
