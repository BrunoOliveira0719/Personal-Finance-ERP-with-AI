import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './auth.strategy';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { SessionAuthGuard } from './session-auth.guard';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User, Session])],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionAuthGuard],
  exports: [AuthService, SessionAuthGuard],
})
export class AuthModule {}
