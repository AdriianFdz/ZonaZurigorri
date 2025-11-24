import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async addFavorite(userId: string, playerId: string): Promise<string[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (!user.favorites.includes(playerId)) {
            user.favorites.push(playerId);
            await this.userRepository.save(user);
        }

        return user.favorites;
    }

    async removeFavorite(userId: string, playerId: string): Promise<string[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        user.favorites = user.favorites.filter((id) => id !== playerId);
        await this.userRepository.save(user);

        return user.favorites;
    }

    async getFavorites(userId: string): Promise<string[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return user.favorites;
    }
}
