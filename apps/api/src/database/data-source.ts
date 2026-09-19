import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

// Loaded here (outside Nest's DI) because the TypeORM CLI runs this file
// directly, without bootstrapping the Nest application context.
config({ path: ['../../.env', '.env'] });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  // `synchronize` is intentionally never enabled: schema changes always go
  // through a reviewed migration. See docs/adr/0002-typeorm-migrations.md.
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
