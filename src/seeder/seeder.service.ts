import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from '../user/user.entity';
import { Image } from '../image/image.entity';
import * as userData from './data/users.json';
import * as imageData from './data/images.json';

@Injectable()
export class SeederService {
  constructor(
    // private keeperService: KeeperService,
    // private trainerService: TrainerService,
    // private animalService: AnimalService
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

  seedIncidents(): void {

  }

}
