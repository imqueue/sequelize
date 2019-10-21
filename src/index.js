"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
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
const js_1 = require("@imqueue/js");
const rpc_1 = require("@imqueue/rpc");
const chalk_1 = require("chalk");
const fs = require("fs");
const path_1 = require("path");
const BaseModel_1 = require("./BaseModel");
var isDefined = js_1.js.isDefined;
var isOk = js_1.js.isOk;
/* models exports! */
__export(require("./BaseDictionary"));
__export(require("./BaseParanoid"));
__export(require("./BaseModel"));
__export(require("./helpers"));
__export(require("./decorators"));
__export(require("./types"));
const JS_EXT_RX = /\.js$/;
/**
 * Returns all files list from a given directory
 *
 * @param {string} dir
 * @return {string[]}
 */
function walk(dir) {
    let results = [];
    for (let file of fs.readdirSync(dir)) {
        file = path_1.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        }
        else {
            results.push(file);
        }
    }
    return results;
}
/**
 * Database connection string from environment variable
 *
 * @type {string}
 */
exports.DB_CONN_STR = process.env.DB_CONN_STR;
/**
 * SQL prettify flag. Can be set by environment variable
 * SQL_PRETTIFY = 1|0. By default is false.
 *
 * @type {boolean}
 */
exports.SQL_PRETTIFY = +(process.env.SQL_PRETTIFY || 0) > 0;
/**
 * SQL colorize flag. Can be set by environment variable
 * SQL_COLORIZE = 1|0. By default is false.
 *
 * @type {boolean}
 */
exports.SQL_COLORIZE = +(process.env.SQL_COLORIZE || 0) > 0;
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
function formatSql(sql) {
    return exports.SQL_PRETTIFY ?
        sqlFormatter.format(sql)
            .replace(RX_SQL_NUM_LAYOUT, '$1 ')
            .replace(RX_SQL_NUM_END, '$1$2')
            .replace(RX_BRK_DBL_AND, '&&')
            .replace(RX_BRK_CAST, '$1')
            .replace(RX_BRK_POCKETS, '$1$2')
        : sql;
}
exports.formatSql = formatSql;
// noinspection SuspiciousTypeOfGuard
/**
 * Returns logging routine property for sequelize config options
 * taking into account configured SQL_PRETTIFY, SQL_COLORIZE environment
 * variables options.
 *
 * @param {ILogger} logger
 * @return {(sql: string, time: number) => string}
 */
const logging = (logger) => (sql, time) => logger.log(exports.SQL_COLORIZE
    ? `${chalk_1.default.bold.yellow('SQL Query:')} ${chalk_1.default.cyan(formatSql(sql.replace(RX_SQL_PREFIX, '')))}`
    : `SQL Query: ${formatSql(sql.replace(RX_SQL_PREFIX, ''))}`, (typeof time === 'number' ? `executed in ${time} ms` : ''));
let orm;
// noinspection JSUnusedGlobalSymbols
/**
 * Initialized all known by this package database models and
 * returns instance of Sequelize, mapped with these models
 *
 * @param {IMQORMOptions} [options]
 * @return {Sequelize}
 */
function database(options) {
    if (typeof orm !== 'undefined') {
        return orm;
    }
    else if (typeof options === 'undefined') {
        throw new TypeError('First call of database() must provide valid options!');
    }
    if (!options.connectionString) {
        if (!exports.DB_CONN_STR) {
            throw new TypeError('Either environment DB_CONN_STR should be set or ' +
                'connectionString property given!');
        }
        options.connectionString = exports.DB_CONN_STR;
    }
    if (!options.connectionString) {
        throw new TypeError('Database connection string is required!');
    }
    if (!options.logger) {
        options.logger = rpc_1.DEFAULT_IMQ_SERVICE_OPTIONS.logger || console;
    }
    options.sequelize.logging =
        !isDefined(options.sequelize.logging) ||
            isOk(options.sequelize.logging)
            ? logging(typeof options.sequelize.logging === 'function'
                ? options.sequelize.logging
                : options.logger)
            : options.sequelize.logging;
    orm = new BaseModel_1.Sequelize(options.connectionString, options.sequelize);
    orm.addModels(walk(path_1.resolve(options.modelsPath))
        .filter(name => JS_EXT_RX.test(name))
        .map(filename => require(filename)[filename.split(path_1.sep)
        .reverse()[0]
        .replace(JS_EXT_RX, '')]));
    options.logger.log('Database models initialized...');
    return orm;
}
exports.database = database;
//# sourceMappingURL=index.js.map