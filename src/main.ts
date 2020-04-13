import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as bodyParser from 'body-parser';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const serverConfig = config.get('server');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    // app.enableCors({ origin: serverConfig.origin });
    // throw new Error('Add code above');
    app.enableCors();
  }

  app.use( bodyParser. json( { limit: '10MB' } ) );

  const seederService = app.get(SeederService);
  seederService.resetDatabase();

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}
bootstrap();
