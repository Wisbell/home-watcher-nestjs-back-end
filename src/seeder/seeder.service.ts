import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from '../user/user.entity';
import { Image } from '../image/image.entity';
import * as userData from './data/users.json';
import * as imageData from './data/images.json';
import { UserService } from '../user/user.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class SeederService {
  constructor(
    private userService: UserService,
    private imageService: ImageService
  ) {}

  seedUsers(): void {
    userData.forEach(async (userJSON) => {

      const { username, password, salt, role } = userJSON;

      const user = {
        username,
        password,
        salt,
        role,
      }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute();
    });
  }

  async deleteUsers(): Promise<void> {
    const allUsers = await this.userService.getAllUsers();

    allUsers.forEach(async (user: User) => {
      await this.userService.deleteUser(user.id.toString());
    });
  }

  seedImages(): void {
    imageData.forEach(async (imageJSON) => {

      const { dateCreated, name, image } = imageJSON;

      const newImage = {
        dateCreated,
        name,
        image
      }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values(newImage)
        .execute();
    });
  }

  async deleteImages(): Promise<void> {
    const allImages = await this.imageService.getAllImages();

    allImages.forEach(async (image: Image) => {
      await this.imageService.deleteImage(image.id.toString());
    });
  }

  seedIncidents(): void {

  }

  private async seedAll(): Promise<void> {
    await this.seedUsers();
    await this.seedImages();
  }

  private async deleteAll(): Promise<void> {
    await this.deleteUsers();
    await this.deleteImages();
  }

  async resetDatabase(): Promise<void> {
    await this.deleteAll();
    await this.resetAllTableSequences();
    await this.seedAll();
  }

  async resetAllTableSequences(): Promise<void> {
    const tableNames = await this.getAllTableNames();
    tableNames.forEach( async (name) => await this.resetTableSequence(name) );
  }

  async resetTableSequence(tableName: string): Promise<void> {
    return await getConnection()
      .createEntityManager()
      .query(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1`);
  }

  async getAllTableNames(): Promise<string[]> {
    const tableNamesFromDB = await getConnection()
      .createEntityManager()
      .query(`SELECT table_name
              FROM information_schema.tables
              WHERE table_schema='public'
              AND table_type='BASE TABLE';`);

    const tableNames = tableNamesFromDB.map( (obj) => {
      if(obj.table_name != 'migration')
        return obj.table_name;
    });

    return tableNames.filter( name => name != null );
  }
}
