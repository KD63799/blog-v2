import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  private readonly notFound = new NotFoundException('Post not found');
  private readonly forbidden = new ForbiddenException('Forbidden Action');

  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: { username: true, email: true },
          },
          comments: {
            include: { user: { select: { username: true, email: true } } },
          },
          images: true,
        },
      }),
      this.prisma.post.count(),
    ]);
    return { data, total };
  }

  async create(createDto: CreatePostDto, userId: number, fileName?: string) {
    return this.prisma.post.create({
      data: {
        ...createDto,
        userId,
        ...(fileName ? { images: { create: { fileName } } } : {}),
      },
      include: { images: true },
    });
  }

  async findByIdOrThrow(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { postId },
      include: { images: true },
    });
    if (!post) throw this.notFound;
    return post;
  }

  async update(postId: number, updateDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { postId },
      data: updateDto,
      include: { images: true },
    });
  }

  async delete(postId: number) {
    return this.prisma.post.delete({ where: { postId } });
  }

  assertOwner(postUserId: number, currentUserId: number) {
    if (postUserId !== currentUserId) throw this.forbidden;
  }
}
