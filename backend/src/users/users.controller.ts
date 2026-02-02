import { Controller, Get, Patch, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.email);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('profile')
    updateProfile(@Request() req, @Body() body) {
        // Prevent updating critical fields like password directly here ideally
        // For now, allow basic updates
        const { password, email, role, balance, ...updateData } = body;
        return this.usersService.update(req.user.userId, updateData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/avatars',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
        // In production, upload to Cloudinary/S3 here
        const avatarUrl = `/uploads/avatars/${file.filename}`;
        return this.usersService.update(req.user.userId, { avatarUrl });
    }
}
