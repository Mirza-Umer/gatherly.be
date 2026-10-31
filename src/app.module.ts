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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusModule } from './event-bus/event-bus.module';
import { MetadataWithSuchNameAlreadyExistsError } from 'typeorm';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    EventBusModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<number>('DB_PORT', 5433)),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'gatherly-db'),
        autoLoadEntities: true,
        synchronize: false,
      }),
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
export class AppModule { }
