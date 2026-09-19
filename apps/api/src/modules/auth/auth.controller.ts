import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { AppConfigService } from '../../config/app-config.service';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './session-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() request: Request & { user: { id: string } },
    @Res() response: Response,
  ) {
    const token = await this.authService.createSession(request.user.id);
    response.cookie('finance_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.isProduction,
      maxAge: this.config.session.ttlDays * 86_400_000,
      path: '/',
    });
    response.redirect(this.config.google.postLoginRedirectUrl);
  }

  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  @Post('signout')
  async signout(@Req() request: Request, @Res() response: Response) {
    await this.authService.revokeSession(request.cookies?.finance_session);
    response.clearCookie('finance_session', { httpOnly: true, sameSite: 'lax', path: '/' });
    response.status(204).send();
  }
}
