import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { PostRepository } from '../post/post.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly repo: LikesRepository,
    private readonly postRepo: PostRepository,
  ) {}

  async likePost(userId: number, postId: number) {
    await this.postRepo.findByIdOrThrow(postId);
    return this.repo.create(userId, postId);
  }

  async unlikePost(userId: number, postId: number) {
    return this.repo.remove(userId, postId);
  }

  async isLiked(userId: number, postId: number): Promise<boolean> {
    return this.repo.exists(userId, postId);
  }

  async countLikes(postId: number): Promise<number> {
    return this.repo.count(postId);
  }

  async getLikers(
    postId: number,
    page = 1,
    limit = 20,
  ): Promise<{
    data: { userId: number; username: string }[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { data, total } = await this.repo.findLikers(postId, page, limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
