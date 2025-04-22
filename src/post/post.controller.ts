import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {PostService} from "./post.service";
import {AuthGuard} from "@nestjs/passport";
import {CreatePostDto} from "./dto/createPost.dto";
import {Request} from "express";
import {UpdatePostDto} from "./dto/updatePost.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags("Posts")
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    ) {
        return this.postService.getAll(page, limit);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    create(@Body() createPostDto : CreatePostDto, @Req() request: Request){
        // @ts-ignore
        const userId = request.user["userId"]
        return this.postService.create(createPostDto, userId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Delete("delete/:id")
    delete(@Param("id", ParseIntPipe) postId: number, @Req() request: Request) {
        // @ts-ignore
        const userId = request.user["userId"];
        return this.postService.delete(postId, userId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Put("update/:id")
    update(@Param("id", ParseIntPipe) postId: number, @Body() updatePostDto: UpdatePostDto,
           @Req() request: Request) {
        // @ts-ignore
        const userId = request.user["userId"];
        return this.postService.update(postId, userId, updatePostDto)
    }

}
