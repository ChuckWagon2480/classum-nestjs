import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Space } from './space.entity';
import { Chat } from './chat.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  postIdx: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ type: 'enum', enum: ['Notice', 'Question'] })
  category: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'SET NULL' })
  writer: User;

  @ManyToOne(() => Space, (space) => space.posts, { onDelete: 'SET NULL' })
  space: Space;

  @OneToMany(() => Chat, (chat) => chat.post, { nullable: true })
  chats: Chat[];
}
