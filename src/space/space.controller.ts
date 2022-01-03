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
import { CreateSpaceDto } from './dto/create-space.dto';
import { JoinSpaceData } from './dto/join-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { SpaceService } from './space.service';

@Controller('spaces')
@UseGuards(AuthGuard('jwt'))
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  createSpace(
    @User() user: { userIdx: number },
    @Body() createSpaceDate: CreateSpaceDto,
  ): Promise<object> {
    return this.spaceService.createSpace(user.userIdx, createSpaceDate);
  }

  @Post('/join')
  joinSpace(
    @User() user: { userIdx: number },
    @Body() joinSpaceData: JoinSpaceData,
  ) {
    return this.spaceService.joinSpace(user.userIdx, joinSpaceData.spaceIdx);
  }

  @Get()
  getSpaceAll(@Query('keyword') keyword: string | null): Promise<object> {
    return this.spaceService.readSpaceAll(keyword ? keyword : '');
  }

  @Get('/:spaceIdx')
  getSpaceDetail(
    @Param('spaceIdx', ParseIntPipe) spaceIdx: number,
  ): Promise<object> {
    return this.spaceService.readSpaceDetail(spaceIdx);
  }

  @Patch('/:spaceIdx')
  async patchSpace(
    @User() user: { userIdx: number },
    @Param('spaceIdx', ParseIntPipe) spaceIdx: number,
    @Body() updateSpaceData: UpdateSpaceDto,
  ) {
    const ownerIdx = await this.spaceService.findOwnerIdx(spaceIdx);
    if (user.userIdx != ownerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.updateSpace(spaceIdx, updateSpaceData);
  }

  @Patch('/:spaceIdx/restore')
  async restoreSpace(
    @User() user: { userIdx: number },
    @Param('spaceIdx', ParseIntPipe) spaceIdx: number,
  ) {
    const ownerIdx = await this.spaceService.findOwnerIdx(spaceIdx);
    if (user.userIdx != ownerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.restoreSpace(spaceIdx);
  }

  @Delete('/:spaceIdx')
  async deleteSpace(
    @User() user: { userIdx: number },
    @Param('spaceIdx', ParseIntPipe) spaceIdx: number,
  ) {
    const ownerIdx = await this.spaceService.findOwnerIdx(spaceIdx);
    if (user.userIdx != ownerIdx)
      throw new HttpException(
        {
          success: false,
          message: '접근할 수 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    return this.spaceService.deleteSpace(spaceIdx);
  }
}
