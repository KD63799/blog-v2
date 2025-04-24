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
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { Create_postDto } from './dto/create_post.dto';
import { Update_postDto } from './dto/update_post.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Get paginated list of posts' })
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.postService.getAll(page, limit);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto: Create_postDto, @Req() request: Request) {
    const userId = (request.user as any).userId;
    return this.postService.create(createPostDto, userId);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'postId', description: 'ID of the post to delete', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:postId')
  delete(@Req() request: Request, @Param('postId', ParseIntPipe) postId: number) {
    const userId = (request.user as any).userId;
    return this.postService.delete(postId, userId);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'postId', description: 'ID of the post to update', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('update/:postId')
  update(
    @Req() request: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: Update_postDto,
  ) {
    const userId = (request.user as any).userId;
    return this.postService.update(postId, userId, updatePostDto);
  }
}
