/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/roles/entities/role.entity';

interface JwtUser {
  id: number;
  email: string;
  role: Roles;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createTicketDto: CreateTicketDto, user: JwtUser) {
    const creator: User | null = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['role'],
    });
    if (!creator) throw new NotFoundException('Creator not found');
    const ticket = this.ticketRepo.create({
      title: createTicketDto.title,
      description: createTicketDto.description,
      priority: createTicketDto.priority,
      created_by: creator,
    });

    return this.ticketRepo.save(ticket);
  }

  async findAll(user: JwtUser) {
    if (user.role === Roles.MANAGER) {
      return this.ticketRepo.find({ relations: ['created_by', 'assigned_to'] });
    }
    if (user.role === Roles.SUPPORT) {
      return this.ticketRepo.find({
        where: { assigned_to: { id: user.id } },
        relations: ['created_by', 'assigned_to'],
      });
    }
    if (user.role === Roles.USER) {
      return this.ticketRepo.find({
        where: { created_by: { id: user.id } },
        relations: ['created_by', 'assigned_to'],
      });
    }
    return [];
  }

  async remove(id: number) {
    const result = await this.ticketRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ticket not found');
    }
    return { deleted: true };
  }

  async assignTicket(id: number, dto: AssignTicketDto, user: JwtUser) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['assigned_to'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const assignee: User | null = await this.userRepo.findOne({
      where: { id: dto.userId },
      relations: ['role'],
    });
    if (!assignee) throw new BadRequestException('User not found');
    if (assignee.role.name === Roles.USER) {
      throw new BadRequestException('Cannot assign to USER role');
    }

    ticket.assigned_to = assignee;
    return this.ticketRepo.save(ticket);
  }

  async updateStatus(id: number, dto: UpdateStatusDto, user: JwtUser) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['assigned_to'],
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (user.role === Roles.SUPPORT && ticket.assigned_to?.id !== user.id) {
      throw new ForbiddenException();
    }

    const order = [
      TicketStatus.OPEN,
      TicketStatus.IN_PROGRESS,
      TicketStatus.RESOLVED,
      TicketStatus.CLOSED,
    ];
    const currentIndex = order.indexOf(ticket.status);
    const nextIndex = order.indexOf(dto.status);
    if (nextIndex === -1) {
      throw new BadRequestException('Invalid status');
    }
    if (nextIndex !== currentIndex + 1) {
      throw new BadRequestException('Invalid status transition');
    }

    ticket.status = dto.status;
    return this.ticketRepo.save(ticket);
  }

  async update(id: number, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.ticketRepo.save(ticket);
  }
}
