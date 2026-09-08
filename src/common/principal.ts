export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export interface IPrincipal {
  userId: string;
  role: Role;
  email: string;
}

export class Principal implements IPrincipal {
  readonly userId: string;
  readonly role: Role;
  readonly email: string;

  constructor(userId: string, role: Role, email: string) {
    this.userId = userId;
    this.role = role;
    this.email = email;
  }
}
