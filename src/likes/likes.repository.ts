import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, postId: number) {
    return this.prisma.postLike.create({
      data: { userId, postId },
    });
  }

  async remove(userId: number, postId: number) {
    return this.prisma.postLike.delete({
      where: { userId_postId: { userId, postId } },
    });
  }

  async exists(userId: number, postId: number): Promise<boolean> {
    const count = await this.prisma.postLike.count({
      where: { userId, postId },
    });
    return count > 0;
  }

  async count(postId: number): Promise<number> {
    return this.prisma.postLike.count({
      where: { postId },
    });
  }

  async findLikers(postId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [likes, total] = await this.prisma.$transaction([
      this.prisma.postLike.findMany({
        where: { postId },
        skip,
        take: limit,
        include: {
          user: {
            select: { userId: true, username: true },
          },
        },
      }),
      this.prisma.postLike.count({ where: { postId } }),
    ]);

    return {
      data: likes.map((pl) => pl.user),
      total,
    };
  }
}
