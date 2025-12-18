import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}


  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  create(@Body() createCommentDto: CreateCommentDto, @GetUser() user: User,) {
    return this.commentsService.create(createCommentDto,user);
  }

  @Get(':id')
  getAllCommentsById(@Param('id') id: number) {
    return this.commentsService.getAllCommentsById(id);
  }

  // @Get()
  // findAll() {
  //   return this.commentsService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentsService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentsService.update(+id, updateCommentDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentsService.remove(+id);
  // }
}
