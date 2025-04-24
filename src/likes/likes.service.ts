import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    return this.prisma.postLike.create({
      data: { userId, postId },
    });
  }

  async unlikePost(userId: number, postId: number) {
    return this.prisma.postLike.delete({
      where: { userId_postId: { userId, postId } },
    });
  }

  async isLiked(userId: number, postId: number): Promise<boolean> {
    const count = await this.prisma.postLike.count({
      where: { userId, postId },
    });
    return count > 0;
  }

  async countLikes(postId: number): Promise<number> {
    return this.prisma.postLike.count({
      where: { postId },
    });
  }

  async getLikers(
    postId: number,
    page = 1,
    limit = 20,
  ): Promise<{
    data: { userId: number; username: string }[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.postLike.findMany({
        where: { postId },
        skip,
        take: limit,
        include: { user: { select: { userId: true, username: true } } },
      }),
      this.prisma.postLike.count({ where: { postId } }),
    ]);

    return {
      data: data.map((pl) => pl.user),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
