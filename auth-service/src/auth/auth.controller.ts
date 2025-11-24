/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('google')
    @ApiOperation({ summary: 'Iniciar login con Google' })
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Guard redirects
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
        const { token } = await this.authService.validateOAuthLogin(req.user);
        // Redirigir al frontend con el token
        res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    }

    @Get('twitter')
    @ApiOperation({ summary: 'Iniciar login con Twitter' })
    @UseGuards(AuthGuard('twitter'))
    async twitterAuth() {
        // Guard redirects
    }

    @Get('twitter/callback')
    @UseGuards(AuthGuard('twitter'))
    async twitterAuthRedirect(@Req() req: any, @Res() res: Response) {
        const { token } = await this.authService.validateOAuthLogin(req.user);
        // Redirigir al frontend con el token
        res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    }

    @Get('discord')
    @ApiOperation({ summary: 'Iniciar login con Discord' })
    @UseGuards(AuthGuard('discord'))
    async discordAuth() {
        // Guard redirects
    }

    @Get('discord/callback')
    @UseGuards(AuthGuard('discord'))
    async discordAuthRedirect(@Req() req: any, @Res() res: Response) {
        const { token } = await this.authService.validateOAuthLogin(req.user);
        // Redirigir al frontend con el token
        res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    }

    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req: any) {
        return req.user as { userId: string; email: string; name: string };
    }
}
