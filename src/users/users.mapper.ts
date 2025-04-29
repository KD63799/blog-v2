import type { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { GetUserDto } from './utils/dto/get-user.dto';

@Injectable()
export class UsersMapper {
  toGetUserDto(user: User): GetUserDto {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
