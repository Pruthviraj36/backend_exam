/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role?: { id: number; name: Roles };
  created_at: Date;
}
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private rolesService: RolesService,
  ) {}

  private buildUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role && {
        id: user.role.id,
        name: user.role.name,
      },
      created_at: user.created_at,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const role = await this.rolesService.createIfNotExists(
      createUserDto.role as Roles,
    );

    const user = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role,
    });

    try {
      await this.userRepo.save(user);
    } catch (err) {
      throw new BadRequestException('User could not be created');
    }

    return this.buildUserResponse(user);
  }

  async findAll() {
    const users = await this.userRepo.find({ relations: ['role'] });
    return users.map((u) => this.buildUserResponse(u));
  }

  async findOne(id: number): Promise<UserResponse | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    return user ? this.buildUserResponse(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (updateUserDto.role) {
      user.role = await this.rolesService.createIfNotExists(
        updateUserDto.role as Roles,
      );
    }
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.password !== undefined)
      user.password = updateUserDto.password;

    try {
      await this.userRepo.save(user);
    } catch {
      throw new BadRequestException('User could not be updated');
    }
    return this.buildUserResponse(user);
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('User not found');
    }
    return { deleted: true };
  }
}
