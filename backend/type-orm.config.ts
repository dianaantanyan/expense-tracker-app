import * as process from 'node:process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmModuleOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),

    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? '',

    database: process.env.DB_NAME ?? 'expense_tracker',

    entities: [`${__dirname}/**/*.entity{.ts,.js}`],

    synchronize: true, // I set this parameter to true for only test tasks
    logging: ['error'],
  };
}