import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
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
  async findAll(@Query() { size, page }: { size: number; page: number }) {
    return await this.postService.getAllPosts(size, page);
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postService.findOne(+id);
  // }
  //
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
