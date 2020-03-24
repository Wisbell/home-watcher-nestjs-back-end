import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(AuthGuard())
  @Get('profile')
  getProfile(@Request() req) {
    console.log('profile called!')
    return req.user;
  }
}
