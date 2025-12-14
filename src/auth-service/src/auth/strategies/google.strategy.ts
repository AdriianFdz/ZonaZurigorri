import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

interface GoogleProfile extends Profile {
    id: string;
    displayName: string;
    emails: Array<{ value: string; verified: boolean }>;
    photos: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
            scope: ['email', 'profile'],
        });
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleProfile,
        done: VerifyCallback,
    ): void {
        const { id, emails, displayName, photos } = profile;
        const user = {
            providerId: id,
            email: emails[0]?.value ?? '',
            name: displayName,
            picture: photos[0]?.value,
            provider: 'google',
        };
        done(null, user);
    }
}
