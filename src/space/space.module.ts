import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from 'src/repository/space.repository';
import { UserRepository } from 'src/repository/user.repository';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceRepository, UserRepository])],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
