import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/post.repository';
import { SpaceRepository } from 'src/repository/space.repository';
import { UserRepository } from 'src/repository/user.repository';
import { SpaceModule } from 'src/space/space.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, SpaceRepository, UserRepository]),
    SpaceModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
