import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from '../auth/auth-credentials.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: string): Promise<User> {
    const userToGet = await this.userRepository.findOne(id);

    if(!userToGet)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userToGet;
  }

  async getUserByUsername(username: string): Promise<User> {
    const userToGet = await this.userRepository.findOne({ username });

    if(!userToGet)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userToGet;
  }

  async createUser(user: User): Promise<User> {
    const checkIfUserExists: User = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: user.username })
      .getOne();

    if(checkIfUserExists)
      throw new HttpException('User with specified username already exists', HttpStatus.CONFLICT);

    return await this.userRepository.save(user);
  }

  // TODO: Don't allow updating of username/password... yet
  async updateUser(id: string, updatedUser: User): Promise<User> {
    if(Number(id) !== updatedUser.id)
      throw new HttpException('Endpoint user id does not match user entity id', HttpStatus.CONFLICT);

    let userToUpdate = await this.userRepository.findOne(id);

    if(!userToUpdate)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    userToUpdate.role = updatedUser.role;

    return await this.userRepository.save(userToUpdate);
  }

  async deleteUser(id: string): Promise<User> {
    const userToRemove = await this.userRepository.findOne(id);

    if(!userToRemove)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.userRepository.remove(userToRemove);

    return userToRemove;
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
    const { username, password } = authCredentialsDto;

    const user: User = await this.userRepository.findOne({ username });

    if (user && await user.validatePassword(password)) {
      const { username, role } = user;
      const jwtPayload: JwtPayload = { username, role }
      return jwtPayload;
    } else {
      return null;
    }
  }
}
