import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRepository } from 'src/repository/chat.repository';
import { PostRepository } from 'src/repository/post.repository';
import { UserRepository } from 'src/repository/user.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository) private chatRepository: ChatRepository,
    private postRepository: PostRepository,
    private userRepository: UserRepository,
  ) {}

  async createChat(
    userIdx: number,
    createChatDto: CreateChatDto,
  ): Promise<object> {
    const { postIdx, parentIdx, content } = createChatDto;
    const post = await this.postRepository.findOne(
      { postIdx },
      { relations: ['chats'] },
    );
    const user = await this.userRepository.findOne(
      { userIdx },
      { relations: ['chats'] },
    );

    const chat = await this.chatRepository.save({ content, parentIdx });
    if (parentIdx) {
      const parentChat = await this.chatRepository.findOne(
        { chatIdx: parentIdx },
        { relations: ['rechat'] },
      );
      if (!parentChat)
        throw new HttpException(
          {
            success: false,
            message: '댓글을 찾을 수 없습니다.',
          },
          HttpStatus.NOT_FOUND,
        );
      parentChat.rechat.push(chat);
      await this.chatRepository.save(parentChat);
    }
    post.chats.push(chat);
    user.chats.push(chat);
    await this.postRepository.save(post);
    await this.userRepository.save(user);

    return { success: true, message: '댓글이 생성되었습니다.' };
  }

  async updateChat(chatIdx: number, chat: UpdateChatDto): Promise<object> {
    const updateResult = await this.chatRepository.update(chatIdx, chat);
    if (updateResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '댓글이 수정되었습니다.',
    };
  }

  async restoreChat(chatIdx: number): Promise<object> {
    const restoreResult = await this.chatRepository.restore({
      chatIdx: chatIdx,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '댓글이 복구되었습니다.' };
  }

  async deleteChat(chatIdx: number): Promise<object> {
    const deleteResult = await this.chatRepository.softDelete({ chatIdx });
    if (deleteResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '댓글이 삭제되었습니다.' };
  }

  async findWriterIdx(chatIdx: number): Promise<number> {
    return await this.chatRepository.selectWriterIdx(chatIdx);
  }

  async findWriterAndOwnerIdx(
    chatIdx: number,
  ): Promise<{ writerIdx: number; ownerIdx: number }> {
    const result = await this.chatRepository.selectWriterAndOwnerIdx(chatIdx);
    if (!result)
      throw new HttpException(
        {
          success: false,
          message: '댓글을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return result;
  }
}
