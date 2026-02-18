import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Like } from '../likes/entities/like.entity';
import { SavedPost } from './entities/savedPost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post,Comment,Like,SavedPost])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
