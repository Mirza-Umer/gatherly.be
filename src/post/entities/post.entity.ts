import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  // ✅ Store image/video URLs
  @Column('simple-array', { nullable: true })
  mediaUrls: string[];

  @Column({ type: 'varchar', nullable: true })
  mediaType: 'image' | 'video' | null;

  // ✅ Post Owner
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: User;

  // ✅ Likes
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  // ✅ Saved Posts
  @ManyToMany(() => User, (user) => user.savedPosts)
  @JoinTable()
  savedByUsers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
