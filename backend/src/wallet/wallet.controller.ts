import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('balance')
    getBalance(@Request() req) {
        return this.walletService.getBalance(req.user.userId);
    }

    @Post('deposit')
    deposit(@Request() req, @Body() body: { amount: number }) {
        return this.walletService.deposit(req.user.userId, Number(body.amount));
    }
}
