import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
    ) {}


  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @Post()
  createUser(@Body() newUser: User) {
    return this.userService.create(newUser);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updatedUser: User) {
    return this.userService.update(updatedUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }

}
