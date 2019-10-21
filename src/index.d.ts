import { ILogger } from '@imqueue/rpc';
import { SequelizeOptions } from 'sequelize-typescript';
import { Sequelize } from './BaseModel';
export * from './BaseDictionary';
export * from './BaseParanoid';
export * from './BaseModel';
export * from './helpers';
export * from './decorators';
export * from './types';
/**
 * ORM database() configuration options. Database connection string
 * can be provided explicitly or by setting DB_CONN_STR environment variable.
 *
 * @type {{
 *  logger: ILogger,
 *  connectionString: string,
 *  sequelize: SequelizeOptions,
 *  modelsPath: string
 * }} IMQORMOptions
 */
export interface IMQORMOptions {
    logger: ILogger;
    connectionString?: string;
    sequelize: SequelizeOptions;
    modelsPath: string;
}
/**
 * Database connection string from environment variable
 *
 * @type {string}
 */
export declare const DB_CONN_STR: string | undefined;
/**
 * SQL prettify flag. Can be set by environment variable
 * SQL_PRETTIFY = 1|0. By default is false.
 *
 * @type {boolean}
 */
export declare const SQL_PRETTIFY: boolean;
/**
 * SQL colorize flag. Can be set by environment variable
 * SQL_COLORIZE = 1|0. By default is false.
 *
 * @type {boolean}
 */
export declare const SQL_COLORIZE: boolean;
/**
 * Returns pretty formatted SQL string of the given input SQL string
 *
 * @param {string} sql
 * @return {string}
 */
export declare function formatSql(sql: string): string;
/**
 * Initialized all known by this package database models and
 * returns instance of Sequelize, mapped with these models
 *
 * @param {IMQORMOptions} [options]
 * @return {Sequelize}
 */
export declare function database(options?: IMQORMOptions): Sequelize;
