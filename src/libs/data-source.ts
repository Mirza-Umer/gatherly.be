import { DataSource } from 'typeorm';
import path from 'node:path';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username:'postgres',
  password:'postgres',
  database: 'gatherly-db',
  entities: [
    path.join(__dirname, '../../**/*.entity.ts')
  ],
  migrations: ['src/migrations/*.ts'],
});