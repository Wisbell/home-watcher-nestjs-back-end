import { Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    // private jwtService: JwtService
    ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.userService.getOneByUsername(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.userId };
  //   return {
  //     // access_token: this.jwtService.sign(payload),
  //   };
  // }

  // async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
  //   const { username, password } = authCredentialsDto;

  //   const user: User = await this.userService.getOneByUsername(username);

  //   if (user && await user.validatePassword(password)) {
  //     return user.username;
  //   } else {
  //     return null;
  //   }
  // }


  async login(authCredentialsDto: AuthCredentialsDto) {
    const username: string = await this.userService.validateUserPassword(authCredentialsDto);

    if (!username)
      throw new UnauthorizedException('Invalid credentials');
  }


  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = 'basic';

    await this.userService.createUser(user);

    // return new NotImplementedException();
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
