import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto, user: User, photo: Express.Multer.File) {
    const newPost = this.postRepo.create({
      title: createPostDto.title,
      caption: createPostDto.caption,
      mediaUrls: createPostDto.mediaUrls,
      user: user,
      photo: photo ? photo.buffer : undefined,
    });
    return this.postRepo.save(newPost);
  }

  // findAll() {
  //   return `This action returns all post`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }
  //
  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
