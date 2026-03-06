import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { FriendRequest } from '../../friend-request/entities/friend-request.entity';
import { Message } from '../../messages/entities/message.entity';
import { SavedPost } from '../../post/entities/savedPost.entity';
import { Follow } from '../../follow/entities/follow.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ type: 'date' })
  Dob: Date;
  @Column({
    type: 'enum',
    enum: ['male', 'female', 'custom'],
    default: 'custom',
  })
  gender: 'male' | 'female' | 'custom';
  @Column()
  phone: string;
  @Column()
  age: number;

  @Column({ nullable: true })
  profilePhoto: string;

  @OneToMany(() => Post, (post) => post.user, { nullable: true })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, { nullable: true })
  likes: Like[];

  @OneToMany(() => FriendRequest, (fr) => fr.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (fr) => fr.receiver)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => SavedPost, (savedPost) => savedPost.user)
  savedPosts: SavedPost[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];
}
