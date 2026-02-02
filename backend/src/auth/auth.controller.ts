import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() userData: Prisma.UserCreateInput) {
        return this.authService.register(userData);
    }

    @Post('login')
    async login(@Body() body) {
        // In a real app, use LocalGuard (passport-local) to validate credentials before calling login
        // For simplicity/demo speed, we'll manually validate or assume validation in service
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
