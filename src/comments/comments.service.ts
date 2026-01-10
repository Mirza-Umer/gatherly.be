import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto, user: User,) {
    console.log(createCommentDto.postId);
    return this.commentRepo.save({
      comment: createCommentDto.comment,
      user: user,
      post: { id: createCommentDto.postId },
    });
  }

  getAllCommentsById(id: number) {
    return this.commentRepo.find({
      where: { post: { id } },
      relations: ['user','post'],
    });
  }

  // findAll() {
  //   return `This action returns all comments`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} comment`;
  // }
  //
  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} comment`;
  // }
}
