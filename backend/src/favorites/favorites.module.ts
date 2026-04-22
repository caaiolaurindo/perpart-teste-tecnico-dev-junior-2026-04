import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorite.entity';
import { Product } from 'src/products/product.entity';
import { Notification } from 'src/notifications/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Product, Notification]),
  ],
  providers: [FavoritesService],
})
export class FavoritesModule {}