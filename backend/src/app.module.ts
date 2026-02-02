import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, SubjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
