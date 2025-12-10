import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  posts: User[];
}
