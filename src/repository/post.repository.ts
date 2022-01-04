import { Post } from 'src/entity/post.entity';
import { EntityRepository, Repository } from 'typeorm';

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
      .leftJoin('post.writer', 'writer')
      .where('post.postIdx = :postIdx', { postIdx: `${postIdx}` })
      .select([
        'post.title as title',
        'post.content as content',
        'post.createdAt as createdAt',
        'post.updatedAt as updatedAt',
        'writer.email as email',
        'writer.firstName as firstName',
        'writer.lastName as lastName',
      ])
      .getRawOne();
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

  async selectSpaceIdx(postIdx: number): Promise<number> {
    const result = await this.createQueryBuilder('post')
      .where('post.postIdx = :postIdx', { postIdx: `${postIdx}` })
      .select('post.spaceSpaceIdx as spaceIdx')
      .withDeleted()
      .getRawOne();

    return result ? result.spaceIdx : 0;
  }
}
