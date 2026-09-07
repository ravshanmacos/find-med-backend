import Knex from 'knex';
// import { GenericModel } from '../core/generic.models';

export type UUID = string;

// export type BaseType = GenericModel;

export type DateORString = string | Date;

export type WhereCondition = Record<string, any> | string;

export type Columns = (string | any)[];

export type Values = Record<string, any>;

export type QueryBuilder = Knex.Knex.QueryBuilder;
