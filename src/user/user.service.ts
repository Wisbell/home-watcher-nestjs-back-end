import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly users: User[]; // TODO: Remove this array

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

  // TODO: remove this function
  async getOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find( user => user.username === username );
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

  async deleteByUsername(username: string): Promise<void> {
    this.users.filter( user => user.username !== username );
  }

  async deleteUser(id: string): Promise<User> {
    const userToRemove = await this.userRepository.findOne(id);

    if(!userToRemove)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.userRepository.remove(userToRemove);

    return userToRemove;
  }
}
