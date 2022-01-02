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
    const users = await this.userService.findOneByEmail(email);
    if (users.length < 1)
      throw new HttpException(
        {
          success: false,
          message: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    const compareResult = await compare(password, users[0].password);
    if (!users || (users && !compareResult)) {
      return null;
    }
    return users;
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
