import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord-auth';
import { ConfigService } from '@nestjs/config';

interface DiscordProfile {
    id: string;
    username: string;
    discriminator: string;
    email: string;
    avatar: string | null;
}

type DiscordDoneCallback = (error: Error | null, user?: unknown) => void;

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(configService: ConfigService) {
        super({
            clientId: configService.get<string>('DISCORD_CLIENT_ID') ?? '',
            clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') ?? '',
            callbackUrl: configService.get<string>('DISCORD_CALLBACK_URL') ?? '',
            scope: ['identify', 'email'],
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: DiscordProfile,
        done: DiscordDoneCallback,
    ): void {
        const { id, username, discriminator, email, avatar } = profile;
        const user = {
            providerId: id,
            email: email,
            name: discriminator !== '0' ? `${username}#${discriminator}` : username,
            picture: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null,
            provider: 'discord',
        };
        done(null, user);
    }
}
