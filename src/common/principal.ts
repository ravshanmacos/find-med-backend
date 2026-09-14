import { UUID } from './types';

export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface IPrincipal {
  userId: UUID;
  role: Role;
  email: string;
}

export class Principal implements IPrincipal {
  readonly userId: UUID;
  readonly role: Role;
  readonly email: string;

  constructor(userId: UUID, role: Role, email: string) {
    this.userId = userId;
    this.role = role;
    this.email = email;
  }
}
