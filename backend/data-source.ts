import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from './src/users/user.entity';
import { Product } from './src/products/product.entity';
import { Category } from './src/categories/category.entity';
import { Favorite } from './src/favorites/favorite.entity';
import { AuditLog } from './src/audit/audit-log.entity';
import { Notification } from './src/notifications/notification.entity';
import UserSeeder from './src/users/user.seed';
import * as dotenv from 'dotenv';
dotenv.config()

console.log('🔍 DADOS DE CONEXÃO LIDOS DO .ENV:', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
});

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  synchronize: true,

  entities: [
    User,
    Product,
    Category,
    Favorite,
    AuditLog,
    Notification,
  ],

  seeds: [UserSeeder],
};

export const AppDataSource = new DataSource(options);