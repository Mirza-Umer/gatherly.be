// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  searchUsers(@Query('searchInput') searchInput: string) {
    return this.usersService.searchUsers(searchInput);
  }

  @Get('currentUser')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User) {
    console.log('USER:', user);
    return this.usersService.getLoggedInUser(user.id);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@GetUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('profile/photo')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${fileExt}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
          callback(null, true);
        } else {
          callback(new Error('Only image files are allowed'), false);
        }
      },
    }),
  )
  uploadProfilePhoto(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `/uploads/${file.filename}`;
    return this.usersService.uploadProfilePhoto(user.id, filePath);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}

