import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuditModule } from './audit/audit.module';
import { Notification } from './notifications/notification.entity';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { Favorite } from './favorites/favorite.entity';
import { AuditLog } from './audit/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: Number(config.get<number>('DATABASE_PORT') ?? 5432),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [User, Product, Category, Favorite, AuditLog, Notification],
        synchronize: true,

      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    FavoritesModule,
    AuditModule,
  ],
})
export class AppModule {}