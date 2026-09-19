import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { AppConfigService } from '../../config/app-config.service';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Session)
    private readonly sessions: Repository<Session>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: AppConfigService,
  ) {}

  async findOrCreateUser(profile: GoogleProfile): Promise<User> {
    const existingUser = await this.users.findOne({ where: { googleId: profile.id } });
    if (existingUser) {
      existingUser.email = profile.email;
      existingUser.name = profile.name;
      existingUser.avatarUrl = profile.avatarUrl;
      return this.users.save(existingUser);
    }

    const user = this.users.create({
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    });
    return this.users.save(user);
  }

  async createSession(userId: string): Promise<string> {
    const rawToken = randomBytes(32).toString('hex');
    const session = this.sessions.create({
      userId,
      tokenHash: this.hashToken(rawToken),
      expiresAt: new Date(Date.now() + this.config.session.ttlDays * 86_400_000),
    });
    await this.sessions.save(session);
    return rawToken;
  }

  async findUserBySessionToken(rawToken: string | undefined): Promise<User | null> {
    if (!rawToken) return null;

    const session = await this.sessions.findOne({
      where: { tokenHash: this.hashToken(rawToken) },
      relations: { user: true },
    });
    if (!session) return null;

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.sessions.remove(session);
      return null;
    }

    return session.user;
  }

  async revokeSession(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return;
    await this.sessions.delete({ tokenHash: this.hashToken(rawToken) });
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
