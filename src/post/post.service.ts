import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreatePostDto} from "./dto/createPostDto";

@Injectable()
export class PostService {
    constructor( private readonly prismaService: PrismaService ) {}
    async create(createPostDto: CreatePostDto, userId: any)   {
        const {body, title} = createPostDto;
        await this.prismaService.post.create({data: {body, title, userId}})
        return {data: "Post successfully created"}
    }
}
