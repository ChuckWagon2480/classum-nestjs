import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SpaceService } from 'src/space/space.service';
import { User } from 'src/user.decorator';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatService } from './chat.service';
import { PostService } from 'src/post/post.service';

@Controller('chats')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly spaceService: SpaceService,
    private readonly postService: PostService,
  ) {}

  @Post()
  async createChat(
    @User() user: { userIdx: number },
    @Body() createChatData: CreateChatDto,
  ): Promise<object> {
    const { postIdx } = createChatData;
    const spaceIdx = await this.postService.findSpaceIdx(postIdx);
    const { members } = await this.spaceService.findMember(spaceIdx);

    if (!members.includes(user.userIdx))
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.chatService.createChat(user.userIdx, createChatData);
  }

  @Patch('/:chatIdx')
  async patchChat(
    @User() user: { userIdx: number },
    @Param('chatIdx', ParseIntPipe) chatIdx: number,
    @Body() updateChatData: UpdateChatDto,
  ) {
    const writerIdx = await this.chatService.findWriterIdx(chatIdx);
    if (user.userIdx != writerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.chatService.updateChat(chatIdx, updateChatData);
  }

  @Patch('/:chatIdx/restore')
  async restoreChat(
    @User() user: { userIdx: number },
    @Param('chatIdx', ParseIntPipe) chatIdx: number,
  ) {
    const writerIdx = await this.chatService.findWriterIdx(chatIdx);
    if (user.userIdx != writerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.chatService.restoreChat(chatIdx);
  }

  @Delete('/:chatIdx')
  async deleteChat(
    @User() user: { userIdx: number },
    @Param('chatIdx', ParseIntPipe) chatIdx: number,
  ) {
    const writerIdx = await this.chatService.findWriterIdx(chatIdx);
    if (user.userIdx != writerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.chatService.deleteChat(chatIdx);
  }
}
