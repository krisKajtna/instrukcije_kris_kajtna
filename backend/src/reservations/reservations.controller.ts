import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createReservationDto: { tutorId: string; subjectId: string; startTime: string; endTime: string; }) {
    return this.reservationsService.create(req.user.userId, createReservationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.reservationsService.findAllForUser(req.user.userId, req.user.role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/confirm')
  confirm(@Request() req, @Param('id') id: string) {
    return this.reservationsService.confirm(req.user.userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/decline')
  decline(@Request() req, @Param('id') id: string) {
    return this.reservationsService.decline(req.user.userId, id);
  }
}
