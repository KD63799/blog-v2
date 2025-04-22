import {ForbiddenException, Get, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreatePostDto} from "./dto/createPost.dto";
import {UpdatePostDto} from "./dto/updatePost.dto";

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {
    }


    @Get()
    async getAll(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [data, total] = await this.prismaService.$transaction([
            this.prismaService.post.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            username: true,
                            email: true,
                        },
                    },
                    comments: {
                        include: {
                            user: {
                                select: {
                                    username: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prismaService.post.count(),
        ]);

        return {
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            data,
        };
    }

    async create(createPostDto: CreatePostDto, userId: any) {
        const {body, title} = createPostDto;
        await this.prismaService.post.create({data: {body, title, userId}})
        return {data: "Post successfully created"}
    }

    async delete(postId: number, userId: any) {
        const post = await this.prismaService.post.findUnique({where: {postId}});
        if (!post) throw new NotFoundException("Post not found")
        if (post.userId != userId) throw new ForbiddenException("Forbidden Action")
        await this.prismaService.post.delete({where: {postId}});
        return {data: "Post deleted"}
    }


    async update(postId: number, userId: any, updatePostDto: UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({where: {postId}});
        if (!post) throw new NotFoundException("Post not found")
        if (post.userId != userId) throw new ForbiddenException("Forbidden Action")
        await this.prismaService.post.update({where: {postId}, data: {...updatePostDto}})
        return {data: "Post updated"}
    }
}
