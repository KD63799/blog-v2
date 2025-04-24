import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Create_commentDto } from './dto/create_comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Update_commentDto } from './dto/update_comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, createCommentDto: Create_commentDto) {
    const { postId, content } = createCommentDto;
    const post = await this.prismaService.post.findUniqueOrThrow({ where: { postId } });
    if (!post) throw new NotFoundException('Post not found');
    await this.prismaService.comment.create({
      data: {
        content,
        userId,
        postId,
      },
    });
    return { data: 'Comment successfully created' };
  }

  async delete(commentId: number, userId: number, postId: number) {
    const comment = await this.prismaService.comment.findFirstOrThrow({ where: { commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.postId != postId) throw new UnauthorizedException('Post id does not match');
    if (comment.userId != userId) throw new ForbiddenException('Forbidden Action');
    await this.prismaService.comment.delete({ where: { commentId } });
    return { data: 'Comment deleted' };
  }

  async update(commentId: number, userId: number, updateCommentDto: Update_commentDto) {
    const { postId, content } = updateCommentDto;
    const comment = await this.prismaService.comment.findFirstOrThrow({ where: { commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.postId != postId) throw new UnauthorizedException('Post id does not match');
    if (comment.userId != userId) throw new ForbiddenException('Forbidden Action');
    await this.prismaService.comment.update({ where: { commentId }, data: { content } });
    return { data: 'Comment Updated' };
  }

  async findByPost(postId: number, { page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;

    await this.prismaService.post.findUniqueOrThrow({
      where: { postId },
    });

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { commentId: 'asc' },
        include: {
          user: {
            select: { username: true, email: true },
          },
        },
      }),
      this.prismaService.comment.count({ where: { postId } }),
    ]);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }
}
