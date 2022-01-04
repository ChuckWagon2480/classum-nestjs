import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { SpaceRepository } from 'src/repository/space.repository';
import { UserRepository } from 'src/repository/user.repository';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(SpaceRepository) private spaceRepository: SpaceRepository,
    private userRepository: UserRepository,
  ) {}

  async createSpace(
    userIdx: number,
    createSpaceDto: CreateSpaceDto,
  ): Promise<object> {
    const { name } = createSpaceDto;
    const user = await this.userRepository.findOne(
      { userIdx },
      { relations: ['spaces'] },
    );
    const space = await this.spaceRepository.save({ name: name, owner: user });
    user.spaces.push(space);
    await this.userRepository.save(user);

    return { success: true, message: '공간 생성에 성공했습니다.' };
  }

  async joinSpace(userIdx: number, spaceIdx: number): Promise<object> {
    const user = await this.userRepository.findOne(
      { userIdx },
      { relations: ['spaces'] },
    );
    const space = await this.spaceRepository.findOne({ spaceIdx });

    user.spaces.push(space);
    await this.userRepository.save(user);

    return { success: true, message: '공간 참여에 성공했습니다.' };
  }

  async readSpaceAll(keyword: string): Promise<object> {
    const spaces = await this.spaceRepository.selectSpaceAll(keyword);

    if (spaces.length == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '공간 조회에 성공했습니다.',
      result: spaces.map((space) => {
        space['memberCount'] = +space['memberCount'];
        return space;
      }),
    };
  }

  async readSpaceDetail(spaceIdx: number): Promise<object> {
    const space = await this.spaceRepository.selectSpaceDetail(spaceIdx);

    if (!space)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '공간 상세조회에 성공했습니다.',
      result: space,
    };
  }

  async updateSpace(spaceIdx: number, space: UpdateSpaceDto): Promise<object> {
    const updateResult = await this.spaceRepository.update(spaceIdx, space);
    if (updateResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '공간정보가 수정되었습니다.',
    };
  }

  async restoreSpace(spaceIdx: number): Promise<object> {
    const restoreResult = await this.spaceRepository.restore({
      spaceIdx: spaceIdx,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '공간이 복구되었습니다.' };
  }

  async deleteSpace(spaceIdx: number): Promise<object> {
    const deleteResult = await this.spaceRepository.softDelete({ spaceIdx });
    if (deleteResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '공간이 삭제되었습니다.' };
  }

  async findOwnerIdx(spaceIdx: number): Promise<number> {
    return await this.spaceRepository.selectOwnerIdx(spaceIdx);
  }

  async findMember(
    spaceIdx: number,
  ): Promise<{ ownerIdx: number; members: number[] }> {
    const result = await this.spaceRepository.selectMember(spaceIdx);
    if (result.length == 0)
      throw new HttpException(
        {
          success: false,
          message: '공간을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    const rt: number[] = [];
    result.map((user) => rt.push(user.userIdx));
    return { ownerIdx: result[0].ownerIdx, members: rt };
  }
}
