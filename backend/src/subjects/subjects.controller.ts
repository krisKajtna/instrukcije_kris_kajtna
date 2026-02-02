import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSubjectDto: Prisma.SubjectCreateInput) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Get(':id/tutors')
  findTutors(@Param('id') id: string) {
    return this.subjectsService.findTutors(id);
  }
}
