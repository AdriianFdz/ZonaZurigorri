import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule { }
