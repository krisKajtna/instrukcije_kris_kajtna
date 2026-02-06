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

      // Deduct from student only (hold in system)
      await prisma.user.update({
        where: { id: studentId },
        data: { balance: { decrement: totalPrice } }
      });

      // Create Reservation PENDING
      return prisma.reservation.create({
        data: {
          studentId,
          tutorId: data.tutorId,
          subjectId: data.subjectId,
          startTime: start,
          endTime: end,
          price: totalPrice,
          status: 'PENDING'
        }
      });
    });
  }

  async confirm(tutorId: string, reservationId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });

      if (!reservation || reservation.tutorId !== tutorId) {
        throw new BadRequestException('Reservation not found or access denied');
      }

      if (reservation.status !== 'PENDING') {
        throw new BadRequestException('Reservation is not pending');
      }

      // Transfer funds to tutor
      await prisma.user.update({
        where: { id: tutorId },
        data: { balance: { increment: reservation.price } }
      });

      // Update status
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: 'CONFIRMED' }
      });
    });
  }

  async decline(tutorId: string, reservationId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });

      if (!reservation || reservation.tutorId !== tutorId) {
        throw new BadRequestException('Reservation not found or access denied');
      }

      if (reservation.status !== 'PENDING') {
        throw new BadRequestException('Reservation is not pending');
      }

      // Refund student
      await prisma.user.update({
        where: { id: reservation.studentId },
        data: { balance: { increment: reservation.price } }
      });

      // Update status
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: 'CANCELLED' }
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
