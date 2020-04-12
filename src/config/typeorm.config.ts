import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  migrationsTableName: 'migration',
  migrationsRun: true,
  logging: true,
  logger: 'file',
  migrations: [`dist/migrations/**/*.{ts,js}`], // NOTE: Dist directory needed or error will be thrown
  cli: {
    migrationsDir: 'src/migrations'
  }
};

// NOTE: typeOrmConfig must be exported like this in order to use typeorm scripts in package.json
export = typeOrmConfig;