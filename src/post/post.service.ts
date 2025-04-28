import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { MinioService } from '../minio/minio.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly minio: MinioService,
  ) {}

  async getAll(page: number, limit: number) {
    const { data, total } = await this.repo.findAll(page, limit);

    const dataWithUrls = await Promise.all(
      data.map(async (post) => {
        const images = await Promise.all(post.images.map((img) => this.minio.getFileUrl(img.fileName)));
        return {
          ...post,
          images,
        };
      }),
    );

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: dataWithUrls,
    };
  }

  async create(createDto: CreatePostDto, userId: number, file?: Express.Multer.File) {
    let fileName: string | undefined;
    if (file) {
      await this.minio.createBucketIfNotExists();
      fileName = await this.minio.uploadFile(file);
    }
    const post = await this.repo.create(createDto, userId, fileName);
    return { data: post };
  }

  async delete(postId: number, userId: number) {
    const post = await this.repo.findByIdOrThrow(postId);
    this.repo.assertOwner(post.userId, userId);
    await this.repo.delete(postId);
    return { data: 'Post deleted' };
  }

  async update(postId: number, userId: number, updateDto: UpdatePostDto) {
    const post = await this.repo.findByIdOrThrow(postId);
    this.repo.assertOwner(post.userId, userId);
    const updated = await this.repo.update(postId, updateDto);
    return { data: updated };
  }

  async getImageUrl(fileName: string) {
    return this.minio.getFileUrl(fileName);
  }
}
