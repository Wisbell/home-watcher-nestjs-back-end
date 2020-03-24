import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { JwtPayload } from '../jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // TODO: Remove this?
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { username, role } = payload;
    const user: User = await this.userService.getUserByUsername(username);

    if (!user)
      throw new UnauthorizedException();

    return user;
  }
}