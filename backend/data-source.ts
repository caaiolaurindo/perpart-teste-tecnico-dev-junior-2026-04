import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension'; 
import { User } from './src/users/user.entity'; 
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
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],

  seeds: [UserSeeder], 
};

export const AppDataSource = new DataSource(options);