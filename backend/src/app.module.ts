import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { WalletModule } from './wallet/wallet.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SubjectsModule, WalletModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
