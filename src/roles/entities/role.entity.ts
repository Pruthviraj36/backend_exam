import { IsEnum } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Roles {
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
  USER = 'USER',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Roles,
    unique: true,
  })
  @IsEnum(Roles)
  name: Roles;
}
