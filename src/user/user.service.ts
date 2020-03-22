import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        role: 'admin'
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
        role: 'basic'
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
        role: 'basic'
      },
    ];
  }

  async getAll(): Promise<User[] | undefined> {
    return this.users;
  }

  async getOne(id: string): Promise<User | undefined> {
    return this.users.find( user => user.userId === parseInt(id) );
  }

  async getOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find( user => user.username === username );
  }

  async create(user: User): Promise<User | undefined> {
    user.userId = User.getMaxId(this.users);
    user.role = 'basic';
    this.users.push(user);
    return user;
  }

  async update(updatedUser: User): Promise<User | undefined> {
    const oldUserData = this.users.find( user => user.userId === updatedUser.userId );
    this.delete( oldUserData.userId.toString() );
    this.users.push(updatedUser);
    return updatedUser;
  }

  async deleteByUsername(username: string): Promise<void> {
    this.users.filter( user => user.username !== username );
  }

  async delete(id: string): Promise<void> {
    this.users.filter( user => user.userId !== parseInt(id) );
  }
}
