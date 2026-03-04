import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ✅ CREATE POST (Image or Video)
  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      fileFilter: (req, file  , callback) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          callback(null, true);
        } else {
          callback(new Error('Only image and video files are allowed'), false);
        }
      },
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.create(createPostDto, user, file);
  }

  // ✅ GET ALL POSTS (Pagination)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllPosts(
    @Query('take') take = 10,
    @Query('page') page = 0,
    @GetUser() currentUser: User,
  ) {
    return this.postService.getAllPosts(+take, +page, currentUser);
  }

  // ✅ GET SAVED POSTS
  @UseGuards(AuthGuard('jwt'))
  @Get('saved')
  getSavedPosts(@GetUser() currentUser: User) {
    return this.postService.getSavedPosts(currentUser.id);
  }

  // ✅ GET POSTS BY USER
  @Get(':userId')
  find(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.getPostsByUserId(userId);
  }

  // ✅ GET SINGLE POST
  @Get('post/:id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  // ✅ SAVE POST
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/save')
  savePost(
    @Param('id', ParseIntPipe) postId: number,
    @GetUser() currentUser: User,
  ) {
    return this.postService.savePost(currentUser.id, postId);
  }

  // ✅ UNSAVE POST
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/unsave')
  unsavePost(
    @Param('id', ParseIntPipe) postId: number,
    @GetUser() currentUser: User,
  ) {
    return this.postService.unsavePost(currentUser.id, postId);
  }
}
