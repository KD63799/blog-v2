import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './utils/dto/get-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './utils/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getUserById(userId: number): Promise<GetUserDto> {
    const user = await this.repo.findByIdOrThrow(userId);
    return this.toDto(user);
  }

  async getCurrentUser(userPayload: { userId: number }): Promise<GetUserDto> {
    return this.getUserById(userPayload.userId);
  }

  async updateUser(requesterId: number, targetId: number, dto: UpdateUserDto): Promise<GetUserDto> {
    if (requesterId !== targetId) {
      throw new ForbiddenException('You can only update your own account');
    }

    const updated = await this.repo.updateById(targetId, dto);
    return this.toDto(updated);
  }

  async deleteUser(requesterId: number, targetId: number): Promise<void> {
    if (requesterId !== targetId) {
      throw new ForbiddenException('You can only delete your own account');
    }
    await this.repo.deleteById(targetId);
  }

  private toDto(u: User): GetUserDto {
    const { userId, username, email, createdAt } = u;
    return { userId, username, email, createdAt };
  }
}
