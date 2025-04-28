import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [], // ConfigModule est déjà global
  controllers: [PostController],
  providers: [PrismaService, MinioService, PostRepository, PostService],
})
export class PostModule {}
