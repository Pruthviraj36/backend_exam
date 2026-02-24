import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;
}
