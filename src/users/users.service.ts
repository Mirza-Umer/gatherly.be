import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async createUser(signUpDto: CreateUserDto): Promise<User> {
    const { email, password } = signUpDto;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      password: hashedPassword,
      Dob: signUpDto.Dob,
      gender: signUpDto.gender,
      phone: signUpDto.phone,
      age: signUpDto.age,
    });

    return this.userRepo.save(newUser);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
  }

  async getLoggedInUser(id: number): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
    })
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }
  //
  // findAll() {
  //   return `This action returns all users`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  //
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
