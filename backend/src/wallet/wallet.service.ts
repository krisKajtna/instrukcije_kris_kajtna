import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async getBalance(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });
        return { balance: user?.balance || 0 };
    }

    // Mock deposit (in real app, use Stripe/PayPal)
    async deposit(userId: string, amount: number) {
        if (amount <= 0) throw new BadRequestException('Amount must be positive');

        const result = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });

            await prisma.transaction.create({
                data: {
                    userId,
                    amount,
                    type: 'DEPOSIT',
                },
            });

            return user;
        });

        return result;
    }

    // Transfer for Reservation payment
    async transfer(fromUserId: string, toUserId: string, amount: number) {
        if (amount <= 0) throw new BadRequestException('Amount must be positive');

        return this.prisma.$transaction(async (prisma) => {
            const sender = await prisma.user.findUnique({ where: { id: fromUserId } });
            if (!sender || sender.balance < amount) {
                throw new BadRequestException('Insufficient funds');
            }

            await prisma.user.update({
                where: { id: fromUserId },
                data: { balance: { decrement: amount } },
            });

            await prisma.user.update({
                where: { id: toUserId },
                data: { balance: { increment: amount } },
            });

            // We could record a transaction record here for history
            // Simplified: Just update balances

            return true;
        });
    }
}
