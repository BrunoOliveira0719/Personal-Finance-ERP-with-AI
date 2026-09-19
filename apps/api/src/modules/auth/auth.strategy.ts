import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AppConfigService } from '../../config/app-config.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: AppConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('Google account did not provide an email address');

    return this.authService.findOrCreateUser({
      id: profile.id,
      email,
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    });
  }
}
