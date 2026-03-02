import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { MessagesModule } from './messages/messages.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'POSTGRES',
      database: 'gatherly-db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    PostModule,
    CommentsModule,
    LikesModule,
    FriendRequestModule,
    MessagesModule,
    AiChatModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
