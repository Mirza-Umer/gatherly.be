import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import { Like } from '../likes/entities/like.entity';
import { SavedPost } from './entities/savedPost.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(SavedPost)
    private readonly savedPostRepo: Repository<SavedPost>,
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

  async getAllPosts(take = 10, page = 0, currentUser?: User) {
    const [posts, total] = await this.postRepo.findAndCount({
      order: { createdAt: 'DESC' },
      relations: [
        'user',
        'likes',
        'likes.user',
        'savedByUsers',
        'savedByUsers.user',
      ],

      take,
      skip: page * take,
    });

    const data = await Promise.all(
      posts.map(async (post: any) => {
        // photo logic (UNCHANGED)
        if (post.photo) {
          let buffer = post.photo;
          const type = await fileTypeFromBuffer(buffer);
          let mimeType = type?.mime || 'image/jpeg';

          if (mimeType.includes('heic') || mimeType.includes('heif')) {
            buffer = await sharp(buffer).png().toBuffer();
            mimeType = 'image/png';
          }

          post.photoUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
        } else {
          post.photoUrl = null;
        }

        console.log('currentUserId', currentUser?.id);
        return {
          ...post,
          likesCount: post.likes.length,
          isLiked: post.likes.some((like) => like.user.id === currentUser?.id),
          isSaved:
            post.savedByUsers?.some(
              (saved) => saved.user.id === currentUser?.id,
            ) || false,
        };
      }),
    );

    return { data, total };
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

  async getPostById(id: number) {
    const post: any = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      return null;
    }

    if (post.photo) {
      let buffer = post.photo;

      const type = await fileTypeFromBuffer(buffer);
      let mimeType = type?.mime || 'image/jpeg';

      // Convert HEIC / HEIF → PNG
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
  }

  async savePost(userId: number, postId: number) {
    const existing = await this.savedPostRepo.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    if (existing) {
      return { message: 'Already saved' };
    }
    const saved = this.savedPostRepo.create({
      user: { id: userId },
      post: { id: postId },
    });
    return await this.savedPostRepo.save(saved);
  }
  async unsavePost(userId: number, postId: number) {
    await this.savedPostRepo.delete({
      user: { id: userId },
      post: { id: postId },
    });
    return { message: 'Post unsaved' };
  }
  async getSavedPosts(userId: number) {
    const savedPosts = await this.savedPostRepo.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user'],
      order: { id: 'DESC' },
    });

    const updated = await Promise.all(
      savedPosts.map(async (item: any) => {
        const post = item.post;

        if (post.photo) {
          const base64 = post.photo.toString('base64');
          post.photoUrl = `data:image/jpeg;base64,${base64}`;
        } else {
          post.photoUrl = null;
        }

        return post; // return only post
      }),
    );

    return updated;
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
