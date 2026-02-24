import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsEnum,
} from 'class-validator';
import { Roles } from 'src/roles/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
