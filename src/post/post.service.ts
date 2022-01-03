import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/post.repository';
import { SpaceRepository } from 'src/repository/space.repository';
import { UserRepository } from 'src/repository/user.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository) private postRepository: PostRepository,
    private spaceRepository: SpaceRepository,
    private userRepository: UserRepository,
  ) {}

  async createPost(
    userIdx: number,
    createPostDto: CreatePostDto,
  ): Promise<object> {
    const { spaceIdx, title, content, category } = createPostDto;
    const space = await this.spaceRepository.findOne(
      { spaceIdx },
      { relations: ['posts'] },
    );
    const user = await this.userRepository.findOne(
      { userIdx },
      { relations: ['posts'] },
    );
    const post = await this.postRepository.save({ title, content, category });
    space.posts.push(post);
    user.posts.push(post);
    await this.spaceRepository.save(space);
    await this.userRepository.save(user);

    return { success: true, message: '게시글 생성에 성공했습니다.' };
  }

  // async joinPost(userIdx: number, postIdx: number): Promise<object> {
  //   const user = await this.userRepository.findOne(
  //     { userIdx },
  //     { relations: ['posts'] },
  //   );
  //   const post = await this.postRepository.findOne({ postIdx });

  //   user.posts.push(post);
  //   await this.userRepository.save(user);

  //   return { success: true, message: '게시물 참여에 성공했습니다.' };
  // }

  async readPostAll(spaceIdx: number, keyword: string): Promise<object> {
    const posts = await this.postRepository.selectPostAll(spaceIdx, keyword);

    if (posts.length == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '게시물 조회에 성공했습니다.',
      result: posts,
    };
  }

  async readPostDetail(postIdx: number): Promise<object> {
    const post = await this.postRepository.selectPostDetail(postIdx);

    if (!post)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '게시물 상세조회에 성공했습니다.',
      result: post,
    };
  }

  async updatePost(postIdx: number, post: UpdatePostDto): Promise<object> {
    const updateResult = await this.postRepository.update(postIdx, post);
    if (updateResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    return {
      success: true,
      message: '게시물이 수정되었습니다.',
    };
  }

  async restorePost(postIdx: number): Promise<object> {
    const restoreResult = await this.postRepository.restore({
      postIdx: postIdx,
    });
    if (restoreResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '게시물이 복구되었습니다.' };
  }

  async deletePost(postIdx: number): Promise<object> {
    const deleteResult = await this.postRepository.softDelete({ postIdx });
    if (deleteResult.affected == 0)
      throw new HttpException(
        {
          success: false,
          message: '게시물을 찾을 수 없습니다.',
        },
        HttpStatus.NOT_FOUND,
      );
    else return { success: true, message: '게시물이 삭제되었습니다.' };
  }

  async findWriterIdx(postIdx: number): Promise<number> {
    return await this.postRepository.selectWriterIdx(postIdx);
  }
}
