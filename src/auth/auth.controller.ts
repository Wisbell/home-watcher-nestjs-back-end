import { Controller, UseGuards, Post, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
    ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('req.user', req.user);
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('loggedIn')
  async loggedIn() {
    return { loggedIn: true };
  }
}
