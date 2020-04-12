import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as typeOrmConfig from './config/typeorm.config';
import { ImageModule } from './image/image.module';
import { IncidentModule } from './incident/incident.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    ImageModule,
    IncidentModule,
    SeederModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
