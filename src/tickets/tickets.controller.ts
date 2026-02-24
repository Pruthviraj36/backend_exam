/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as RoleEnum } from 'src/roles/entities/role.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.MANAGER)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req: any) {
    return this.ticketsService.create(createTicketDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.SUPPORT, RoleEnum.USER)
  @Get()
  findAll(@Req() req: any) {
    return this.ticketsService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.SUPPORT, RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ticketsService.findOne(+id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.SUPPORT)
  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body() dto: AssignTicketDto,
    @Req() req: any,
  ) {
    return this.ticketsService.assignTicket(+id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.SUPPORT)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Req() req: any,
  ) {
    return this.ticketsService.updateStatus(+id, dto, req.user);
  }
}
