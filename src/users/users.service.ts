import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
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
      relations: ['sentFriendRequests', 'receivedFriendRequests',],
    })
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.find({
      relations: { sentFriendRequests: true, receivedFriendRequests: true },
    });
  }

  async searchUsers(searchInput: string): Promise<User[]> {
    return await this.userRepo.find({
      where: [{ firstName: ILike(`%${searchInput}%`) },
      { lastName: ILike(`%${searchInput}%`) },
      ],
      relations: ['sentFriendRequests', 'receivedFriendRequests',],
    });
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async uploadProfilePhoto(id: number, filePath: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.profilePhoto = filePath;
    return this.userRepo.save(user);
  }
}

