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
import { Post } from './post.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  chatIdx: number;

  @Column({ type: 'varchar', length: 50 })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @OneToMany(() => Chat, (chat) => chat.parent)
  rechat: Chat[];

  @ManyToOne(() => Chat, (chat) => chat.rechat, { onDelete: 'SET NULL' })
  parent: Chat;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: 'SET NULL' })
  writer: User;

  @ManyToOne(() => Post, (post) => post.chats, { onDelete: 'SET NULL' })
  post: Post;
}
