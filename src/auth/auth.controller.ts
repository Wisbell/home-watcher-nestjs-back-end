import { Controller, UseGuards, Post, Get, Request, Body, ValidationPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
    ) {}

  @Post('register')
  async register(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log('authCredentialsDto', authCredentialsDto);
    return this.authService.register(authCredentialsDto);
  }

  @Post('login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise< { accessToken: string } > {
    return this.authService.login(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Post('test')
  async test(@Req() req): Promise<void> {
    console.log('req' ,req)
  }
}
