import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SpaceService } from 'src/space/space.service';
import { User } from 'src/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly spaceService: SpaceService,
  ) {}

  @Post()
  async createPost(
    @User() user: { userIdx: number },
    @Body() createPostData: CreatePostDto,
  ): Promise<object> {
    const { spaceIdx } = createPostData;
    const { ownerIdx, members } = await this.spaceService.findMember(spaceIdx);

    if (!members.includes(user.userIdx))
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    if (ownerIdx == user.userIdx) createPostData['category'] = 'Notice';
    else createPostData['category'] = 'Question';

    return this.postService.createPost(user.userIdx, createPostData);
  }

  @Get()
  async getPostAll(
    @User() user: { userIdx: number },
    @Query('spaceIdx') spaceIdx: number,
    @Query('keyword') keyword: string | null,
  ): Promise<object> {
    const { members } = await this.spaceService.findMember(spaceIdx);

    if (!members.includes(user.userIdx))
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.(공간의 멤버가 아닙니다.)',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.postService.readPostAll(spaceIdx, keyword ? keyword : '');
  }

  @Get('/:postIdx')
  async getPostDetail(
    @User() user: { userIdx: number },
    @Param('postIdx', ParseIntPipe) postIdx: number,
  ): Promise<object> {
    const spaceIdx = await this.postService.findSpaceIdx(postIdx);
    const { members } = await this.spaceService.findMember(spaceIdx);

    if (!members.includes(user.userIdx))
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.(공간의 멤버가 아닙니다.)',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.postService.readPostDetail(postIdx);
  }

  @Patch('/:postIdx')
  async patchPost(
    @User() user: { userIdx: number },
    @Param('postIdx', ParseIntPipe) postIdx: number,
    @Body() updatePostData: UpdatePostDto,
  ) {
    const writerIdx = await this.postService.findWriterIdx(postIdx);
    if (user.userIdx != writerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );

    delete updatePostData.category;
    return this.postService.updatePost(postIdx, updatePostData);
  }

  @Patch('/:postIdx/restore')
  async restorePost(
    @User() user: { userIdx: number },
    @Param('postIdx', ParseIntPipe) postIdx: number,
  ) {
    const writerIdx = await this.postService.findWriterIdx(postIdx);
    if (user.userIdx != writerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.postService.restorePost(postIdx);
  }

  @Delete('/:postIdx')
  async deletePost(
    @User() user: { userIdx: number },
    @Param('postIdx', ParseIntPipe) postIdx: number,
  ) {
    const { writerIdx, ownerIdx } =
      await this.postService.findWriterAndOwnerIdx(postIdx);

    if (user.userIdx != writerIdx && user.userIdx != ownerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.postService.deletePost(postIdx);
  }
}
