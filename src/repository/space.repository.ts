import { Space } from 'src/entity/space.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {
  async selectSpaceAll(keyword: string): Promise<object[]> {
    const result = await this.createQueryBuilder('space')
      .where('space.name like :keyword', { keyword: `%${keyword}%` })
      .select([
        'space.spaceIdx as spaceIdx',
        'space.name as name',
        'space.createdAt as createdAt',
        'space.updatedAt as updatedAt',
      ])
      .addSelect('SUM(1)', 'memberCount')
      .leftJoin('space.users', 'users')
      .addGroupBy('space.spaceIdx')
      .getRawMany();

    return result;
  }
  async selectSpaceDetail(spaceIdx: number): Promise<Space> {
    const [result] = await this.createQueryBuilder('space')
      .where('space.spaceIdx = :spaceIdx', { spaceIdx: `${spaceIdx}` })
      .leftJoinAndSelect('space.owner', 'owner')
      .leftJoinAndSelect('space.users', 'users')
      .select([
        'space.spaceIdx',
        'space.name',
        'space.createdAt',
        'space.updatedAt',
        'owner.userIdx',
        'owner.email',
        'owner.firstName',
        'owner.lastName',
        'owner.profileUrl',
        'users.userIdx',
        'users.email',
        'users.firstName',
        'users.lastName',
        'users.profileUrl',
      ])
      .getMany();
    return result;
  }

  async selectOwnerIdx(spaceIdx: number): Promise<number> {
    const result = await this.createQueryBuilder('space')
      .where('space.spaceIdx = :spaceIdx', { spaceIdx: `${spaceIdx}` })
      .leftJoinAndSelect('space.owner', 'owner')
      .withDeleted()
      .getOne();
    return result ? result.owner.userIdx : 0;
  }

  async selectMember(
    spaceIdx: number,
  ): Promise<{ ownerIdx: number; members: number[] }> {
    const result = await this.createQueryBuilder('space')
      .where('space.spaceIdx = :spaceIdx', { spaceIdx: `${spaceIdx}` })
      .leftJoin('space.users', 'users')
      .leftJoin('space.owner', 'owner')
      .select(['users.userIdx as userIdx', 'owner.userIdx as ownerIdx'])
      .getRawMany();

    const rt: number[] = [];
    result.map((user) => rt.push(user.userIdx));
    return { ownerIdx: result[0].userIdx, members: rt };
  }
}
