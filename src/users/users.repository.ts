import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './utils/dto/update-user.dto';

@Injectable()
export class UsersRepository {
  private readonly notFound = new NotFoundException('User not found');

  constructor(private readonly prisma: PrismaService) {}

  async findByIdOrThrow(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw this.notFound;
    return user;
  }

  async updateById(userId: number, data: Partial<UpdateUserDto>): Promise<User> {
    return this.prisma.user.update({
      where: { userId },
      data,
    });
  }

  async deleteById(userId: number): Promise<void> {
    await this.prisma.user.delete({ where: { userId } });
  }
}
