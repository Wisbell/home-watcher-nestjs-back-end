import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository, SelectQueryBuilder, QueryBuilder } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';


const mockUserRepository = jest.fn(() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnValueOnce(true),
  }))
}));

function createTestUser(id: number, username: string, password: string, role: string): User {
  const user = new User();
  user.id = id;
  user.username = username;
  user.password = password;
  user.role = role;
  return user;
}


describe('UserService', () => {
  let userService: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  /**
   * Get All User Tests
   */
  it('should return all users when calling getAllUsers', async () => {
    // Arrange
    const testUsers = [
      createTestUser(1,'testUserOne', 'password1', 'admin'),
      createTestUser(2,'testUserTwo', 'password2', 'basic'),
      createTestUser(3,'testUserThree', 'password3', 'basic')
    ];

    // Act
    jest.spyOn(repository, 'find').mockResolvedValueOnce(testUsers);

    // Assert
    expect(await userService.getAllUsers()).toEqual(testUsers);
  });

  /**
   * Get User Tests
   */
  it('should return specified user when calling getUser with id', async () => {
    // Arrange
    const testUser = createTestUser(1,'testUserOne', 'password1', 'admin');

    // Act
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser);

    // Assert
    expect(await userService.getUser('1')).toEqual(testUser);
  });

  it('should return 404 if user does not exist when calling GetUser with id', async () => {
    // Arrange
    const testUser = undefined;

    try {
      // Act
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser);
      await userService.getUser('1');
    } catch (error) {
      // Assert
      expect(error).toHaveProperty('message', 'User not found');
      expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
    }
  });

  /**
   * Create User Tests
   */
  it('should return newly created user when calling createUser with user model', async () => {
    // Arrange
    const newUser = createTestUser(null, 'newUser', 'password', 'admin');
    const savedUser = createTestUser(1, 'newUser', 'password', 'admin');

    // Act
    jest.spyOn(repository, 'save').mockResolvedValueOnce(savedUser);

    // Assert
    expect(await userService.createUser(newUser)).toEqual(savedUser);
  });

  it.only('should return a 409 conflict error if a user with the provided username already exists', async () => {
    // Arrange
    const alreadyExistingUser = createTestUser(1, 'newUser', 'password', 'admin');

    try {
      // Act
      await userService.createUser(alreadyExistingUser);
      fail()
    } catch (error) {
      // Assert
      expect(error).toHaveProperty('message', 'User with specified username already exists');
      expect(error).toHaveProperty('status', HttpStatus.CONFLICT);
    }
  });

  /**
   * Update User Tests
   */
  it('should return an updated user when calling updateUser with user id and user model', async () => {
    // Arrange
    const originalUser = createTestUser(1, 'testUserOne', 'pass1', 'basic');
    const updatedUser = createTestUser(1, 'testUserOne', 'pass1', 'admin');

    // Act
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(originalUser);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedUser);

    // Assert
    const updatedAndSavedUser = await userService.updateUser('1', updatedUser);
    expect(updatedAndSavedUser).toEqual(updatedUser);
    expect(updatedAndSavedUser.role).toEqual('admin');
  });

  it('should return a 409 conflict error if the route id and updatedUser entity id do not match when calling updateUser', async () => {
    // Arrange
    try {
      // Act
      await userService.updateUser('1', createTestUser(2, '', '', ''));
    } catch (error) {
      // Assert
      expect(error).toHaveProperty('message', 'Endpoint user id does not match user entity id');
      expect(error).toHaveProperty('status', HttpStatus.CONFLICT);
    }
  });


  it('should return a 404 user not found error if the userToUpdate model is not found in the database when calling updateUser', async () => {
    // Arrange
    try {
      // Act
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      await userService.updateUser('1', createTestUser(1, '', '', ''));
    } catch (error) {
      // Assert
      expect(error).toHaveProperty('message', 'User not found');
      expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
    }
  });

  /**
   * Delete User Tests
   */
  it('should return the deleted user when calling deleteUser with user id', async () => {
    // Arrange
    const testUser = createTestUser(1, 'deleteThisUser', 'password', 'basic');

    // Act
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser);
    jest.spyOn(repository, 'remove').mockResolvedValueOnce(testUser);

    // Assert
    expect(await userService.deleteUser('1')).toEqual(testUser);
  });

  it('should return 404 user not found if the the user does not exist when calling deleteUser with id', async () => {
    // Arrange
    try {
      // Act
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      await userService.deleteUser('1');
    } catch (error) {
      // Assert
      expect(error).toHaveProperty('message', 'User not found');
      expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
    }
  });
});
