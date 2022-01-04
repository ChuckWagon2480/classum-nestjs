import { Post } from 'src/entity/post.entity';
import { EntityRepository, Repository } from 'typeorm';

function parseColumn(column: Array<string>, prefix: string) {
  return column.map((col) => prefix + col);
}

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async selectPostAll(spaceIdx: number, keyword: string): Promise<object[]> {
    const result = await this.createQueryBuilder('post')
      .leftJoin('post.writer', 'writer')
      .leftJoin('post.space', 'space')
      .where('space.spaceIdx = :spaceIdx', { spaceIdx: spaceIdx })
      .andWhere('post.title like :keyword', { keyword: `%${keyword}%` })
      .select([
        'post.postIdx as postIdx',
        'post.title as title',
        'writer.firstName as firstName',
        'writer.lastName as lastName',
        'post.createdAt as createdAt',
        'post.updatedAt as updatedAt',
      ])
      .getRawMany();
    return result;
  }

  async selectPostDetail(postIdx: number): Promise<Post> {
    const result = await this.createQueryBuilder('post')
      .leftJoin('post.writer', 'postWriter')
      .leftJoin('post.chats', 'chat', 'chat.parent IS NULL')
      .leftJoin('chat.writer', 'chatWriter')
      .leftJoin('chat.rechat', 'rechat')
      .leftJoin('rechat.writer', 'rechatWriter')
      .where('post.postIdx = :postIdx', { postIdx: `${postIdx}` })
      .select([
        ...parseColumn(
          ['postIdx', 'title', 'content', 'category', 'createdAt', 'updatedAt'],
          'post.',
        ),
        ...parseColumn(
          ['userIdx', 'email', 'firstName', 'lastName', 'profileUrl'],
          'postWriter.',
        ),
        ...parseColumn(['chatIdx', 'content', 'createdAt'], 'chat.'),
        ...parseColumn(['chatIdx', 'content', 'createdAt'], 'rechat.'),
        ...parseColumn(
          ['userIdx', 'firstName', 'lastName', 'profileUrl'],
          'chatWriter.',
        ),
        ...parseColumn(
          ['userIdx', 'firstName', 'lastName', 'profileUrl'],
          'rechatWriter.',
        ),
      ])
      .orderBy('chat.createdAt', 'DESC')
      .addOrderBy('rechat.createdAt', 'DESC')
      .getOne();
    return result;
  }

  async selectWriterIdx(postIdx: number): Promise<number> {
    const result = await this.createQueryBuilder('post')
      .where('post.postIdx = :postIdx', { postIdx: `${postIdx}` })
      .leftJoinAndSelect('post.writer', 'writer')
      .withDeleted()
      .getOne();
    return result ? result.writer.userIdx : 0;
  }

  async selectSpaceIdx(postIdx: number): Promise<any> {
    const result = await this.createQueryBuilder('post')
      .where('post.postIdx = :postIdx', { postIdx: `${postIdx}` })
      .select('post.spaceSpaceIdx as spaceIdx')
      .withDeleted()
      .getRawOne();

    return result;
  }
}
