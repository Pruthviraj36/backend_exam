import { IsNotEmpty, IsInt } from 'class-validator';

export class AssignTicketDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
