import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
    ) {}

  async login(authCredentialsDto: AuthCredentialsDto): Promise< { accessToken: string } > {
    // Change to return user dto or user object
    const payload: JwtPayload = await this.userService.validateUserPassword(authCredentialsDto);

    if (!payload)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = 'basic';

    await this.userService.createUser(user);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
