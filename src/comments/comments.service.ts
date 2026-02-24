/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return this.commentRepo.find();
  }

  findOne(id: number) {
    return this.commentRepo.findOneBy({ id });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    // return this.commentRepo.update(id, updateCommentDto);
    return `updated at ${id}`;
  }

  remove(id: number) {
    return this.commentRepo.delete(id);
  }
}
