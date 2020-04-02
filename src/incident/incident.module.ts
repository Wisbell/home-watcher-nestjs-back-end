import { Module } from '@nestjs/common';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { Incident } from './incident.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ImageService } from '../image/image.service';
import { Image } from '../image/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    TypeOrmModule.forFeature([Image]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [IncidentController],
  providers: [
    IncidentService,
    ImageService
  ]
})
export class IncidentModule {}
