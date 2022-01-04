import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { ChatRepository } from 'src/repository/chat.repository';
import { PostRepository } from 'src/repository/post.repository';
import { UserRepository } from 'src/repository/user.repository';
import { SpaceModule } from 'src/space/space.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository, PostRepository, UserRepository]),
    SpaceModule,
    PostModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
