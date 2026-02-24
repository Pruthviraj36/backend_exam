import { Roles } from 'src/roles/entities/role.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Roles;
}
