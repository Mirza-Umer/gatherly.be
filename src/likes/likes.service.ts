import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  async likePost(postId: number, user: User) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['likes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likeRepo.findOne({
      where: {
        post: { id: postId },
        user: { id: user.id },
      },
    });

    if (existingLike) {
      await this.likeRepo.remove(existingLike);
    } else {
      const like = this.likeRepo.create({ post, user });
      await this.likeRepo.save(like);
    }

    const likesCount = await this.likeRepo.count({
      where: { post: { id: postId } },
    });

    return {
      postId,
      likesCount,
      isLiked: !existingLike,
    };
  }

  // create(createLikeDto: CreateLikeDto) {
  //   return 'This action adds a new like';
  // }
  //
  // findAll() {
  //   return `This action returns all likes`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} like`;
  // }
  //
  // update(id: number, updateLikeDto: UpdateLikeDto) {
  //   return `This action updates a #${id} like`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} like`;
  // }
}
