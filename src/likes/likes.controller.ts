import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private likeService: LikesService) {}

  @Post()
  @ApiOperation({ summary: 'Like a post' })
  @UseGuards(AuthGuard('jwt'))
  like(@Req() req, @Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.likePost((req.user as any).userId, postId);
  }

  @Delete()
  @ApiOperation({ summary: 'Unlike a post' })
  @UseGuards(AuthGuard('jwt'))
  unlike(@Req() req, @Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.unlikePost((req.user as any).userId, postId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get number of likes' })
  getCount(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.countLikes(postId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Has the user liked?' })
  @UseGuards(AuthGuard('jwt'))
  isLiked(@Req() req, @Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.isLiked((req.user as any).userId, postId);
  }
  
  @Get('likers')
  @ApiOperation({ summary: 'Get likers' })
  getLikers(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.getLikers(postId);
  }
}
