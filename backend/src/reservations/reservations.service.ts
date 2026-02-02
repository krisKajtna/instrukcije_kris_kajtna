import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService
  ) { }

  async create(studentId: string, data: { tutorId: string; subjectId: string; startTime: string; endTime: string; }) {
    // 1. Get Price
    const tutorSubject = await this.prisma.tutorSubject.findUnique({
      where: {
        tutorId_subjectId: { tutorId: data.tutorId, subjectId: data.subjectId }
      }
    });

    if (!tutorSubject) {
      throw new BadRequestException('Tutor does not teach this subject');
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    // Calculate hours
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalPrice = Math.ceil(hours * tutorSubject.price);

    // 2. Check Balance & Transfer
    // Transactional reservation + payment
    return this.prisma.$transaction(async (prisma) => {
      const student = await prisma.user.findUnique({ where: { id: studentId } });
      if (!student || student.balance < totalPrice) {
        throw new BadRequestException('Insufficient balance');
      }

      // Deduct from student
      await prisma.user.update({
        where: { id: studentId },
        data: { balance: { decrement: totalPrice } }
      });

      // Add to tutor
      await prisma.user.update({
        where: { id: data.tutorId },
        data: { balance: { increment: totalPrice } }
      });

      // Create Reservation
      return prisma.reservation.create({
        data: {
          studentId,
          tutorId: data.tutorId,
          subjectId: data.subjectId,
          startTime: start,
          endTime: end,
          price: totalPrice,
          status: 'CONFIRMED'
        }
      });
    });
  }

  async findAllForUser(userId: string, role: 'STUDENT' | 'TUTOR') {
    if (role === 'STUDENT') {
      return this.prisma.reservation.findMany({
        where: { studentId: userId },
        include: { tutor: { select: { firstName: true, lastName: true } }, subject: true }
      });
    } else {
      return this.prisma.reservation.findMany({
        where: { tutorId: userId },
        include: { student: { select: { firstName: true, lastName: true } }, subject: true }
      });
    }
  }
}
