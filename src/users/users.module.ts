import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersRepository, UsersService, UsersMapper],
  exports: [UsersService],
})
export class UsersModule {}
