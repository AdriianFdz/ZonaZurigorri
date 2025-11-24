import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

interface OAuthProfile {
    providerId: string;
    email: string;
    name: string;
    picture?: string;
    provider: string;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async validateOAuthLogin(profile: OAuthProfile): Promise<{ user: User; token: string }> {
        let user = await this.userRepository.findOne({
            where: { providerId: profile.providerId },
        });

        if (!user) {
            user = this.userRepository.create({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                provider: profile.provider,
                providerId: profile.providerId,
            });
            await this.userRepository.save(user);
        }

        const payload = { email: user.email, sub: user.id, name: user.name };
        const token = this.jwtService.sign(payload);

        return { user, token };
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }
}
