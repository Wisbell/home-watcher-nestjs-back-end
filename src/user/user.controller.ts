import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body() newUser: User) {
    return this.userService.createUser(newUser);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updatedUser: User) {
    return this.userService.updateUser(id, updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
