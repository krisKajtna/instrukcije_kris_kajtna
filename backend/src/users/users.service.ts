import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async addTutorSubject(userId: string, subjectId: string, price: number) {
        return this.prisma.tutorSubject.create({
            data: {
                tutorId: userId,
                subjectId,
                price,
            },
        });
    }

    async getTutorSubjects(userId: string) {
        return this.prisma.tutorSubject.findMany({
            where: { tutorId: userId },
            include: { subject: true },
        });
    }
}
