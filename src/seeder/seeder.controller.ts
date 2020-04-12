import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(
    private seederService: SeederService
  ) {}

  @Post('users')
  async seedUsers() {
    try {
      this.seederService.seedUsers();
      return { success: "Seeding of user table successful" }
    }
    catch (error) {
      return { error: "Seeding of user table failed" }
    }

  }

  @Post('images')
  async seedImages() {
    try {
      this.seederService.seedImages();
      return { success: "Seeding of image table successful" }
    }
    catch (error) {
      return { error: "Seeding of image table failed" }
    }
  }

  @Post('incidents')
  async seedIncidents() {
    try {
      this.seederService.seedIncidents();
      return { success: "Seeding of incident table successful" }
    }
    catch (error) {
      return { error: "Seeding of incident table failed" }
    }
  }
}
