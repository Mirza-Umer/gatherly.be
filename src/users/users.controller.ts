// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
