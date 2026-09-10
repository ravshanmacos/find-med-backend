import { Client, Pool, PoolClient } from 'pg';

export type Queryable = Client | PoolClient | Pool;

export type WhereInParamsType = {
  [key: string]: string[];
};

export const tableNames = {
  products: 'products',
  users: 'users',
  patients: 'patients',
  doctors: 'doctors',
  refreshTokens: 'refresh_tokens',
  doctorInvites: 'doctor_invites',
  specialties: 'specialties',
  doctorSpecialties: 'doctor_specialties',
  workplaces: 'workplaces',
  doctorWorkplaces: 'doctor_workplaces',
  regions: 'regions',
  districts: 'districts',
};
