import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.SubjectCreateInput) {
    return this.prisma.subject.create({ data });
  }

  findAll() {
    return this.prisma.subject.findMany();
  }

  findOne(id: string) {
    return this.prisma.subject.findUnique({ where: { id } });
  }

  findTutors(subjectId: string) {
    return this.prisma.tutorSubject.findMany({
      where: { subjectId },
      include: {
        tutor: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, bio: true }
        }
      }
    });
  }
}
