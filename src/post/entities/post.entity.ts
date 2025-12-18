import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ nullable: true })
  caption: string;

  @Column('simple-array', { nullable: true })
  mediaUrls: string[];

  @Column({ type: 'bytea', nullable: true })
  photo: Uint8Array;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post , (Post) => Post.comments , {nullable: true})
  comments: Post[];


}
