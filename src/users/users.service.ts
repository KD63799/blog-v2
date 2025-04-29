import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { GetUserDto } from './utils/dto/get-user.dto';
import { UpdateUserDto } from './utils/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly mapper: UsersMapper,
  ) {}

  async getUserById(userId: number): Promise<GetUserDto> {
    const user = await this.repo.findByIdOrThrow(userId);
    return this.mapper.toGetUserDto(user);
  }

  async updateUser(requesterId: number, targetId: number, dto: UpdateUserDto): Promise<GetUserDto> {
    if (requesterId !== targetId) throw new ForbiddenException();
    const updated = await this.repo.updateById(targetId, dto as any);
    return this.mapper.toGetUserDto(updated);
  }

  async deleteUser(requesterId: number, targetId: number): Promise<void> {
    if (requesterId !== targetId) throw new ForbiddenException();
    await this.repo.deleteById(targetId);
  }
}
