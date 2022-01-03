import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Space {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  spaceIdx: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.ownSpaces, { onDelete: 'SET NULL' })
  owner: User;

  @OneToMany(() => Post, (post) => post.space, { onDelete: 'SET NULL' })
  posts: Post[];

  @ManyToMany(() => User, (user) => user.spaces)
  users: User[];
}
