import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Thin typed wrapper around Nest's ConfigService so the rest of the app
 * never reads `process.env` or untyped string keys directly.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.getOrThrow<string>('NODE_ENV');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get apiPort(): number {
    return this.config.getOrThrow<number>('API_PORT');
  }

  get webOrigin(): string[] {
    return this.config
      .getOrThrow<string>('WEB_ORIGIN')
      .split(',')
      .map((origin) => origin.trim());
  }

  get database() {
    return {
      host: this.config.getOrThrow<string>('POSTGRES_HOST'),
      port: this.config.getOrThrow<number>('POSTGRES_PORT'),
      username: this.config.getOrThrow<string>('POSTGRES_USER'),
      password: this.config.getOrThrow<string>('POSTGRES_PASSWORD'),
      database: this.config.getOrThrow<string>('POSTGRES_DB'),
    };
  }

  get session() {
    return {
      secret: this.config.getOrThrow<string>('SESSION_SECRET'),
      ttlDays: this.config.get<number>('SESSION_TTL_DAYS', 7),
    };
  }

  get google() {
    return {
      clientId: this.config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: this.config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackUrl: this.config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      postLoginRedirectUrl: this.config.getOrThrow<string>('POST_LOGIN_REDIRECT_URL'),
    };
  }
}
