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
import { CommentService } from './comment.service';
import { Request } from 'express';
import { Create_commentDto } from './dto/create_comment.dto';
import { Update_commentDto } from './dto/update_comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() request: Request, @Body() createCommentDto: Create_commentDto) {
    const userId = (request.user as any).userId;
    return this.commentService.create(userId, createCommentDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'commentId', description: 'ID of the comment to delete', type: Number })
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:commentId')
  delete(
    @Req() request: Request,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body('postId', ParseIntPipe) postId: number,
  ) {
    const userId = (request.user as any).userId;
    return this.commentService.delete(commentId, userId, postId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'commentId', description: 'ID of the comment to update', type: Number })
  @UseGuards(AuthGuard('jwt'))
  @Put('update/:commentId')
  update(
    @Req() request: Request,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: Update_commentDto,
  ) {
    const userId = (request.user as any).userId;
    return this.commentService.update(commentId, userId, updateCommentDto);
  }

  @ApiOperation({ summary: 'Get all comments for a given post' })
  @ApiParam({ name: 'postId', description: 'ID of the post whose comments to retrieve', type: Number })
  @Get('post/:postId')
  getByPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('20'), ParseIntPipe) limit: number,
  ) {
    return this.commentService.findByPost(postId, { page, limit });
  }
}
