/*!
 * @imqueue/sequelize - Sequelize ORM refines for @imqueue
 *
 * Copyright (c) 2019, imqueue.com <support@imqueue.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
import { js } from '@imqueue/js';
import { DEFAULT_IMQ_SERVICE_OPTIONS, ILogger } from '@imqueue/rpc';
import * as chalk from 'chalk';
import * as fs from 'fs';
import { resolve, sep } from 'path';
import { SequelizeOptions } from 'sequelize-typescript';
import { Sequelize } from './BaseModel';
import isDefined = js.isDefined;
import isOk = js.isOk;

/* models exports! */
export * from './BaseModel';
export * from './helpers';
export * from './decorators';
export * from './types';

const JS_EXT_RX = /\.js$/;

/**
 * Returns all files list from a given directory
 *
 * @param {string} dir
 * @return {string[]}
 */
function walk(dir: string) {
    let results: string[] = [];

    for (let file of fs.readdirSync(dir)) {
        file = resolve(dir, file);

        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    }

    return results;
}

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
export const DB_CONN_STR = process.env.DB_CONN_STR;

/**
 * SQL prettify flag. Can be set by environment variable
 * SQL_PRETTIFY = 1|0. By default is false.
 *
 * @type {boolean}
 */
export const SQL_PRETTIFY = +(process.env.SQL_PRETTIFY || 0) > 0;

/**
 * SQL colorize flag. Can be set by environment variable
 * SQL_COLORIZE = 1|0. By default is false.
 *
 * @type {boolean}
 */
export const SQL_COLORIZE = +(process.env.SQL_COLORIZE || 0) > 0;

// tslint:disable-next-line:no-var-requires
const sqlFormatter = require('sql-formatter');
const RX_SQL_NUM_LAYOUT = /\s+(['"]?\d+['"]?,?)\r?\n/g;
const RX_SQL_NUM_END = /(\d+['"]?)\s+(\))/g;
const RX_BRK_DBL_AND = /&\s+&/g;
const RX_BRK_CAST = /\s+(\[|::)(\s+)?/g;
const RX_BRK_POCKETS = /(\$)\s+(\d)/g;
const RX_SQL_PREFIX = /Execut(ed|ing) \(default\):/;

/**
 * Returns pretty formatted SQL string of the given input SQL string
 *
 * @param {string} sql
 * @return {string}
 */
export function formatSql(sql: string): string {
    return SQL_PRETTIFY ?
        sqlFormatter.format(sql)
            .replace(RX_SQL_NUM_LAYOUT, '$1 ')
            .replace(RX_SQL_NUM_END, '$1$2')
            .replace(RX_BRK_DBL_AND, '&&')
            .replace(RX_BRK_CAST, '$1')
            .replace(RX_BRK_POCKETS, '$1$2')
        : sql;
}

// noinspection SuspiciousTypeOfGuard
/**
 * Returns logging routine property for sequelize config options
 * taking into account configured SQL_PRETTIFY, SQL_COLORIZE environment
 * variables options.
 *
 * @param {ILogger} logger
 * @return {(sql: string, time: number) => string}
 */
const logging = (logger: ILogger) => (sql: string, time: number) =>
    logger.log(SQL_COLORIZE
        ? `${(chalk.bold.yellow as (...args: any[]) => any)('SQL Query:')} ${
            (chalk.cyan  as (...args: any[]) => any)(
                formatSql(sql.replace(RX_SQL_PREFIX, '')
            ))}`
        : `SQL Query: ${formatSql(sql.replace(RX_SQL_PREFIX, ''))}`,
        (typeof time === 'number' ? `executed in ${time} ms` : '')
    );

let orm: Sequelize;

// noinspection JSUnusedGlobalSymbols
/**
 * Initialized all known by this package database models and
 * returns instance of Sequelize, mapped with these models
 *
 * @param {IMQORMOptions} [options]
 * @return {Sequelize}
 */
export function database(
    options?: IMQORMOptions,
): Sequelize {
    if (typeof orm !== 'undefined') {
        return orm;
    } else if (typeof options === 'undefined') {
        throw new TypeError(
            'First call of database() must provide valid options!'
        );
    }

    if (!options.connectionString) {
        if (!DB_CONN_STR) {
            throw new TypeError(
                'Either environment DB_CONN_STR should be set or ' +
                'connectionString property given!'
            );
        }

        options.connectionString = DB_CONN_STR;
    }

    if (!options.connectionString) {
        throw new TypeError('Database connection string is required!')
    }

    if (!options.logger) {
        options.logger = DEFAULT_IMQ_SERVICE_OPTIONS.logger || console;
    }

    options.sequelize.logging =
        !isDefined(options.sequelize.logging) ||
        isOk(options.sequelize.logging)
            ? logging(
                typeof options.sequelize.logging === 'function'
                    ? options.sequelize.logging as any as ILogger
                    : options.logger,
            )
            : options.sequelize.logging as boolean;

    orm = new Sequelize(options.connectionString as string, options.sequelize);

    orm.addModels(walk(resolve(options.modelsPath))
        .filter(name => JS_EXT_RX.test(name))
        .map(filename => require(filename)[
            filename.split(sep)
                .reverse()[0]
                .replace(JS_EXT_RX, '')
            ]));

    options.logger.log('Database models initialized...');

    return orm;
}
