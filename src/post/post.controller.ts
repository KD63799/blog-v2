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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Get paginated list of posts' })
  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.postService.getAll(page, limit);
  }

  @ApiOperation({ summary: 'Create a new post (avec image)' })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  @Post('create')
  create(@Req() req: Request, @UploadedFile() file: Express.Multer.File, @Body() createDto: CreatePostDto) {
    const userId = (req.user as any).userId;
    return this.postService.create(createDto, userId, file);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:postId')
  delete(@Req() req: Request, @Param('postId', ParseIntPipe) postId: number) {
    const userId = (req.user as any).userId;
    return this.postService.delete(postId, userId);
  }

  @ApiOperation({ summary: 'Update a post' })
  @UseGuards(AuthGuard('jwt'))
  @Put('update/:postId')
  update(@Req() req: Request, @Param('postId', ParseIntPipe) postId: number, @Body() dto: UpdatePostDto) {
    const userId = (req.user as any).userId;
    return this.postService.update(postId, userId, dto);
  }

  @Get('images/:fileName')
  getImageUrl(@Param('fileName') fileName: string) {
    return this.postService.getImageUrl(fileName);
  }
}
