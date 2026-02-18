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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  @UseInterceptors(FileInterceptor('photo')) // <-- name must match Angular form
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.postService.create(createPostDto, user, photo);
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllPosts(
    @Query('take') take = 10,
    @Query('page') page = 0,
    @GetUser() currentUser: User,
  ) {
    return this.postService.getAllPosts(take, page, currentUser);
  }

  @UseGuards(AuthGuard('jwt')) @Get('saved') async getSavedPosts(
    @GetUser() currentUser: User,
  ) {
    return await this.postService.getSavedPosts(currentUser.id);
  }

  @Get(':userId')
  find(@Param('userId') userId: number) {
    console.log(userId);
    return this.postService.getPostsByUserId(userId);
  }

  @Get('post/:id')
  getPostById(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @UseGuards(AuthGuard('jwt')) @Post(':id/save') async savePost(
    @Param('id') postId: string,
    @GetUser() currentUser: User,
  ) {
    console.log('userId', currentUser.id, 'postId', +postId);
    return await this.postService.savePost(currentUser.id, +postId);
  }
  @UseGuards(AuthGuard('jwt')) @Delete(':id/unsave') async unsavePost(
    @Param('id') postId: string,
    @GetUser() currentUser: User,
  ) {
    return await this.postService.unsavePost(currentUser.id, +postId);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
