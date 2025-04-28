import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LikesRepository } from './likes.repository';
import { PostRepository } from '../post/post.repository';

@Module({
  imports: [PrismaModule],
  providers: [LikesService, LikesRepository, PostRepository],
  controllers: [LikesController],
})
export class LikesModule {}
