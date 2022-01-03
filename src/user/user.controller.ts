import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserData: CreateUserDto): Promise<object> {
    return this.userService.createUser(createUserData);
  }

  @Get()
  checkEmail(@Query('email') email: string) {
    return this.userService.checkEmail(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userIdx')
  getUser(
    @User() user: { userIdx: number },
    @Param('userIdx', ParseIntPipe) userIdx: number,
  ) {
    if (user.userIdx != userIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.readUserProfile(userIdx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:userIdx')
  patchUser(
    @User() user: { userIdx: number },
    @Param('userIdx', ParseIntPipe) userIdx: number,
    @Body() updateUserData: UpdateUserDto,
  ) {
    if (user.userIdx != userIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.updateUser(userIdx, updateUserData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:userIdx/restore')
  restoreUser(
    @User() user: { userIdx: number },
    @Param('userIdx', ParseIntPipe) userIdx: number,
  ) {
    if (user.userIdx != userIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.restoreUser(userIdx);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:userIdx')
  deleteUser(
    @User() user: { userIdx: number },
    @Param('userIdx', ParseIntPipe) userIdx: number,
  ) {
    if (user.userIdx != userIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.deleteUser(userIdx);
  }
}
