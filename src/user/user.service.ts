import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<object> {
    await this.checkEmail(createUserDto.email);
    const result = await this.userRepository.insertUser(createUserDto);
    return result
      ? { success: true, message: '회원가입에 성공했습니다.' }
      : { success: false, message: '회원가입에 실패했습니다.' };
  }

  async checkEmail(email: string): Promise<object> {
    const result = await this.userRepository.selectUserByEmail(email);
    if (result.length > 0)
      throw new HttpException(
        {
          success: false,
          message: '이미 존재하는 이메일입니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    else return { success: true, message: '사용가능한 이메일입니다.' };
  }

  async readUserProfile(userIdx: number): Promise<object> {
    const userInfo = await this.userRepository.selectUserInfo(userIdx);
    if (!userInfo)
      throw new HttpException(
        {
          success: false,
          message: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    return this.userRepository.selectUserInfo(userIdx);
  }

  async updateUser(userIdx: number, user: UpdateUserDto): Promise<object> {
    const updateResult = await this.userRepository.updateUser(userIdx, user);

    return {
      success: true,
      message: '회원정보가 수정되었습니다.',
      result: updateResult,
    };
  }

  async restoreUser(userIdx: number): Promise<object> {
    const restoreResult = await this.userRepository.restore({
      userIdx: userIdx,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '계정이 복구되었습니다.' };
  }

  async deleteUser(userIdx: number): Promise<object> {
    const deleteResult = await this.userRepository.softDelete({
      userIdx: userIdx,
    });
    if (deleteResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '회원 탈퇴되었습니다.' };
  }

  async findOneByEmail(email: string): Promise<User[]> {
    return this.userRepository.selectUserByEmail(email);
  }
}
