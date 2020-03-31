import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const serverConfig = config.get('server');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    // app.enableCors({ origin: serverConfig.origin });
    throw new Error('Add code above');
  }

  app. use( bodyParser. json( { limit: '10MB' } ) );

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}
bootstrap();
