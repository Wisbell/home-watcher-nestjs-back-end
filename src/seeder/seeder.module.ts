import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { ImageService } from '../image/image.service';
import { Image } from '../image/image.entity';
import { Incident } from '../incident/incident.entity';
import { IncidentService } from '../incident/incident.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Incident])
  ],
  controllers: [
    SeederController
  ],
  providers: [
    SeederService,
    UserService,
    ImageService,
    IncidentService
  ]
})
export class SeederModule {}
