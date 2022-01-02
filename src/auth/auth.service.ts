import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user)
      throw new HttpException(
        {
          success: false,
          message: '회원정보를 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else if (user.deletedAt !== null)
      throw new HttpException(
        {
          success: false,
          message: '탈퇴된 회원입니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    const compareResult = await compare(password, user.password);
    if (!compareResult) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    const jwt = this.jwtService.sign({ userIdx: user.userIdx });
    return {
      success: true,
      message: '로그인에 성공했습니다.',
      result: { userIdx: user.userIdx, jwt: jwt },
    };
  }
}
