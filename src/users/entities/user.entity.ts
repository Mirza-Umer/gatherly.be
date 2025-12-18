import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

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

  @OneToMany(() => Post, (post) => post.user, { nullable: true })
  posts: User[];

  @OneToMany(() => Comment, (comment) => comment.user, { nullable: true })
  comments: User[];

}
