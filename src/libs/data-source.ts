import { DataSource } from 'typeorm';
import path from 'node:path';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gatherly-db',
  entities: [
    path.join(__dirname, '../../**/*.entity.ts'),
  ],
  migrations: ['src/migrations/*.ts'],
});
