import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // TypeOrmModule.forFeature([KeeperRepository]),
  ],
  controllers: [
    SeederController
  ],
  providers: [
    SeederService
  ]
})
export class SeederModule {}
