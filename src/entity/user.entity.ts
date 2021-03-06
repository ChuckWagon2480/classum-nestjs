import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Space } from './space.entity';
import { Post } from './post.entity';
import { Chat } from './chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  userIdx: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  profileUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @OneToMany(() => Space, (space) => space.owner, { nullable: true })
  ownSpaces: Space[];

  @OneToMany(() => Post, (post) => post.writer, { nullable: true })
  posts: Post[];

  @OneToMany(() => Chat, (chat) => chat.writer, { nullable: true })
  chats: Chat[];

  @ManyToMany(() => Space, (space) => space.users)
  @JoinTable({
    name: 'user_space',
    joinColumn: {
      name: 'userIdx',
      referencedColumnName: 'userIdx',
    },
    inverseJoinColumn: {
      name: 'spaceIdx',
      referencedColumnName: 'spaceIdx',
    },
  })
  spaces: Space[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
