import { Chat } from 'src/entity/chat.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  async selectChatAll(postIdx: number, keyword: string): Promise<object[]> {
    const result = await this.createQueryBuilder('chat')
      .leftJoin('chat.writer', 'writer')
      .leftJoin('chat.post', 'post')
      .where('post.postIdx = :postIdx', { postIdx: postIdx })
      .andWhere('chat.title like :keyword', { keyword: `%${keyword}%` })
      .select([
        'chat.chatIdx as chatIdx',
        'chat.title as title',
        'writer.firstName as firstName',
        'writer.lastName as lastName',
        'chat.createdAt as createdAt',
        'chat.updatedAt as updatedAt',
      ])
      .getRawMany();
    return result;
  }

  async selectChatDetail(chatIdx: number): Promise<Chat> {
    const result = await this.createQueryBuilder('chat')
      .leftJoin('chat.writer', 'writer')
      .where('chat.chatIdx = :chatIdx', { chatIdx: `${chatIdx}` })
      .select([
        'chat.title as title',
        'chat.content as content',
        'chat.createdAt as createdAt',
        'chat.updatedAt as updatedAt',
        'writer.email as email',
        'writer.firstName as firstName',
        'writer.lastName as lastName',
      ])
      .getRawOne();
    return result;
  }

  async selectWriterIdx(chatIdx: number): Promise<number> {
    const result = await this.createQueryBuilder('chat')
      .where('chat.chatIdx = :chatIdx', { chatIdx: `${chatIdx}` })
      // .leftJoinAndSelect('chat.writer', 'writer')
      .select('chat.writer')
      .withDeleted()
      .getRawOne();
    return result ? result.writerUserIdx : 0;
  }
}
