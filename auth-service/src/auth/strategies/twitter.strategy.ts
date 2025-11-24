import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor(private configService: ConfigService) {
        super({
            consumerKey: configService.get<string>('TWITTER_CONSUMER_KEY'),
            consumerSecret: configService.get<string>('TWITTER_CONSUMER_SECRET'),
            callbackURL: configService.get<string>('TWITTER_CALLBACK_URL'),
            includeEmail: true,
        });
    }

    async validate(
        token: string,
        tokenSecret: string,
        profile: any,
        done: Function,
    ): Promise<any> {
        const { id, username, displayName, emails, photos } = profile;
        const user = {
            providerId: id,
            email: emails?.[0]?.value || `${username}@twitter.com`,
            name: displayName || username,
            picture: photos?.[0]?.value,
            provider: 'twitter',
        };
        done(null, user);
    }
}
