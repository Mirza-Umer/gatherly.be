import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto, user: User, photo: Express.Multer.File) {
    return this.postRepo.save({
      title: createPostDto.title,
      caption: createPostDto.caption,
      mediaUrls: createPostDto.mediaUrls,
      user: user,
      photo: photo ? photo.buffer : undefined,
    });
  }

  async getAllPosts(take = 10, page = 0) {
    const [data, total] = await this.postRepo.findAndCount({
      relations: ['user'],
      take,
      skip: page * take,
    });

    const updated = await Promise.all(
      data.map(async (post: any) => {
        if (post.photo) {
          let buffer = post.photo;

          // Detect type from buffer
          const type = await fileTypeFromBuffer(buffer);
          let mimeType = type?.mime || 'image/jpeg';

          // Convert HEIC → PNG
          if (mimeType.includes('heic') || mimeType.includes('heif')) {
            buffer = await sharp(buffer).png().toBuffer();
            mimeType = 'image/png';
          }

          // Convert to base64
          const base64 = buffer.toString('base64');
          post.photoUrl = `data:${mimeType};base64,${base64}`;
        } else {
          post.photoUrl = null;
        }

        return post;
      }),
    );

    return { data: updated, total };
  }

  async getPostsByUserId(id: number) {
    const posts = await this.postRepo.find({
      where: { user: { id } },
      relations: ['user'],
    });

    const updated = await Promise.all(
      posts.map(async (post: any) => {
        if (post.photo) {
          let buffer = post.photo;

          const type = await fileTypeFromBuffer(buffer);
          let mimeType = type?.mime || 'image/jpeg';

          // Convert HEIC or unsupported type → PNG
          if (mimeType.includes('heic') || mimeType.includes('heif')) {
            buffer = await sharp(buffer).png().toBuffer();
            mimeType = 'image/png';
          }

          const base64 = buffer.toString('base64');
          post.photoUrl = `data:${mimeType};base64,${base64}`;
        } else {
          post.photoUrl = null;
        }

        return post;
      }),
    );

    return { posts: updated };
  }

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