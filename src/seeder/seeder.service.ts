import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from '../user/user.entity';
import { Image } from '../image/image.entity';
import { Incident } from '../incident/incident.entity';
import * as userData from './data/users.json';
import * as imageData from './data/images.json';
import * as incidentData from './data/incidents.json';
import { UserService } from '../user/user.service';
import { ImageService } from '../image/image.service';
import { IncidentService } from '../incident/incident.service';
import { IncidentDto } from '../incident/incident.dto';

@Injectable()
export class SeederService {
  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private incidentService: IncidentService
  ) {}

  async seedUsers(): Promise<void> {
    for (const seedUser of userData) {
      const { username, password, salt, role } = seedUser;

      const user = {
        username,
        password,
        salt,
        role
      }

      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();
    }
  }

  async deleteUsers(): Promise<void> {
    const allUsers = await this.userService.getAllUsers();

    allUsers.forEach(async (user: User) => {
      await this.userService.deleteUser(user.id.toString());
    });
  }

  async seedImages(): Promise<void> {
    for (const seedImage of imageData) {
      const { dateCreated, name, image } = seedImage;

      const newSeedImage = new Image();
      newSeedImage.dateCreated = dateCreated;
      newSeedImage.name = name;
      newSeedImage.image = image;

      await this.imageService.saveImage(newSeedImage);
    }
  }

  async deleteImages(): Promise<void> {
    const allImages = await this.imageService.getAllImages();

    allImages.forEach(async (image: Image) => {
      await this.imageService.deleteImage(image.id.toString());
    });
  }

  async seedIncidents(): Promise<void> {
    for (const seedInicdent of incidentData) {
      const { dateCreated, text, imageId } = seedInicdent;

      const newIncident = new IncidentDto(
        null,
        text,
        dateCreated,
        imageId
      );

      await this.incidentService.create(newIncident);
    }
  }

  async deleteIncidents(): Promise<void> {
    const allIncidents = await this.incidentService.getAll();

    allIncidents.forEach(async (incident: Incident) => {
      await this.incidentService.delete(incident.id.toString());
    });
  }

  private async seedAll(): Promise<void> {
    await this.seedUsers();
    await this.seedImages();
    await this.seedIncidents();
  }

  private async deleteAll(): Promise<void> {
    await this.deleteIncidents();
    await this.deleteImages();
    await this.deleteUsers();
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
