import { Client, Pool, PoolClient } from 'pg';

export type Queryable = Client | PoolClient | Pool;

export type WhereInParamsType = {
  [key: string]: string[];
};

export const tableNames = {
  cron: 'cron',
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

export enum CronNames {
  TIMER_CRON = 'TIMER-CRON',
  CROP_CRON = 'CROP_CRON',
  HARVEST_CRON = 'HARVEST_CRON',
}
