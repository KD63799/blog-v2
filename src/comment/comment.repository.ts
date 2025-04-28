import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentRepository {
  private readonly notFoundComment = new NotFoundException('Comment not found');
  private readonly notFoundPost = new NotFoundException('Post not found');

  constructor(private readonly prisma: PrismaService) {}

  async findPostByIdOrThrow(postId: number) {
    const post = await this.prisma.post.findUnique({ where: { postId } });
    if (!post) throw this.notFoundPost;
    return post;
  }

  async create(userId: number, postId: number, content: string) {
    return this.prisma.comment.create({
      data: { userId, postId, content },
    });
  }

  async findByIdOrThrow(commentId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { commentId } });
    if (!comment) throw this.notFoundComment;
    return comment;
  }

  async update(commentId: number, content: string) {
    return this.prisma.comment.update({
      where: { commentId },
      data: { content },
    });
  }

  async remove(commentId: number) {
    return this.prisma.comment.delete({ where: { commentId } });
  }

  async findByPost(postId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { commentId: 'asc' },
        include: {
          user: { select: { username: true, email: true } },
        },
      }),
      this.prisma.comment.count({ where: { postId } }),
    ]);
    return { data, total };
  }
}
