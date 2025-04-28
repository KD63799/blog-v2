import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly repo: CommentRepository) {}

  async create(userId: number, dto: CreateCommentDto) {
    const { postId, content } = dto;
    await this.repo.findPostByIdOrThrow(postId);
    await this.repo.create(userId, postId, content);
    return { data: 'Comment successfully created' };
  }

  async delete(commentId: number, userId: number, postId: number) {
    const comment = await this.repo.findByIdOrThrow(commentId);
    if (comment.postId !== postId) throw new UnauthorizedException('Post id does not match');
    if (comment.userId !== userId) throw new ForbiddenException('Forbidden Action');
    await this.repo.remove(commentId);
    return { data: 'Comment deleted' };
  }

  async update(commentId: number, userId: number, dto: UpdateCommentDto) {
    const { postId, content } = dto;
    const comment = await this.repo.findByIdOrThrow(commentId);
    if (comment.postId !== postId) throw new UnauthorizedException('Post id does not match');
    if (comment.userId !== userId) throw new ForbiddenException('Forbidden Action');
    await this.repo.update(commentId, content);
    return { data: 'Comment Updated' };
  }

  async findByPost(
    postId: number,
    page: number,
    limit: number,
  ): Promise<{
    data: { commentId: number; content: string; user: { username: string; email: string } }[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    await this.repo.findPostByIdOrThrow(postId);
    const { data, total } = await this.repo.findByPost(postId, page, limit);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
