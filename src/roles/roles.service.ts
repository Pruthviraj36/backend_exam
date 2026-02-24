import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Roles } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly repo: Repository<Role>,
  ) {}

  findByName(name: Roles) {
    return this.repo.findOne({ where: { name } });
  }

  async createIfNotExists(name: Roles) {
    let role = await this.findByName(name);
    if (!role) {
      role = this.repo.create({ name });
      await this.repo.save(role);
    }
    return role;
  }
}
