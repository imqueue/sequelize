"use strict";
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
/**
 * This modules provides several additional features on top of
 * original Sequelize ORM implementation:
 *  1. Support of views. To define a model as a view in database, use
 *     @View(CREATE_VIEW_SQL: string) decorator factory
 *     @example
 *     ~~~typescript
 *     @View(
 *       `CREATE OR REPLACE VIEW "ProductRevenue" AS
 *        SELECT "productId" as "id", SUM("payment") as "revenue"
 *        FROM "Order" GROUP BY "productId"`
 *     )
 *     export class ProductRevenue extends BaseModel<ProductRevenue> {
 *         @Column(DataType.BIGINT)
 *         @PrimaryKey
 *         public readonly id: number;
 *
 *         @Column(DataType.NUMBER({ decimals: 2, precision: 12 }}))
 *         public readonly revenue: number;
 *     }
 *     ~~~
 *     All views would be automatically synced after all tables synced, when
 *     Sequelize.sync() called.
 *
 *  2. Support of { returning: [field1, field2, ...] } instead of
 *     { returning: boolean }. This gives an ability to fetch and return only
 *     requested properties during insert/update operations. By the way it
 *     would require to cast the proper options type passed to corresponding
 *     sequelize operation. Those types have been mimic in this module, so
 *     them should be exported from it:
 *     @example
 *     ~~~typescript
 *     import { SaveOptions, Scope, UpdateOptions } from './orm';
 *     //
 *     // ... init models and somewhere inside async function:
 *     //
 *     const scope = new Scope({
 *       name: 'test',
 *       description: 'Test Scope',
 *       schema: {},
 *     });
 *     // take into account type casting to prevent TS errors:
 *     await scope.save({ returning: ['id', 'name'] } as SaveOptions);
 *     console.log(JSON.stringify(scope)); // {"id":2,"name":"test"}
 *     // or
 *     const [count, scopes] = await Scope.update({ name: "TEST" }, {
 *       where: { id: 2 },
 *       // take into account type casting to prevent TS errors:
 *       returning: ['id', 'name'] as UpdateOptions,
 *     });
 *     console.log(JSON.stringify(scopes)); // {"id":2,"name":"TEST"}
 *     ~~~
 *     This behavior gives an ability to reduce data exchange between DB and
 *     application as well as between app and external source as far as
 *     serialized model will contain only requested data (if any remote source
 *     applicable).
 *     So, whenever you found TS error about returning option on your code,
 *     simply cast options to the same type name as error states, but import
 *     this type from this module.
 */
const Promise = require("bluebird");
const sequelize_typescript_1 = require("sequelize-typescript");
/**
 * Original toJSON method from sequelize's Model class.
 */
const toJSON = sequelize_typescript_1.Model.prototype.toJSON;
const castNumber = (value) => +value;
const NUMBERS_MAP = new Map([
    [sequelize_typescript_1.DataType.BIGINT.name, castNumber],
    [sequelize_typescript_1.DataType.NUMBER.name, castNumber],
    [sequelize_typescript_1.DataType.INTEGER.name, castNumber],
    [sequelize_typescript_1.DataType.FLOAT.name, castNumber],
    [sequelize_typescript_1.DataType.REAL.name, castNumber],
    [sequelize_typescript_1.DataType.DECIMAL.name, castNumber],
    [sequelize_typescript_1.DataType.MEDIUMINT.name, castNumber],
    [sequelize_typescript_1.DataType.SMALLINT.name, castNumber],
    [sequelize_typescript_1.DataType.TINYINT.name, castNumber],
    [sequelize_typescript_1.DataType.DOUBLE.name, castNumber],
]);
function fixReturningOptions(options) {
    if (options &&
        options.returning &&
        Array.isArray(options.returning) &&
        !options.returning.length) {
        options.returning = false;
    }
}
/**
 * Overrides queryInterface behavior to add support of views definition
 *
 * @param {QueryInterface} queryInterface
 */
function override(queryInterface) {
    const { insert, upsert, bulkInsert, update, bulkUpdate, bulkDelete, select, increment, rawSelect, } = queryInterface;
    const del = queryInterface.delete;
    /**
     * Inserts a new record
     */
    queryInterface.insert = function (instance, tableName, values, options) {
        fixReturningOptions(options);
        return insert.call(this, instance, tableName, values, options);
    };
    /**
     * Inserts or Updates a record in the database
     */
    queryInterface.upsert = function (tableName, values, updateValues, model, options) {
        fixReturningOptions(options);
        return upsert.call(this, tableName, values, updateValues, model, options);
    };
    /**
     * Inserts multiple records at once
     */
    queryInterface.bulkInsert = function (tableName, records, options, attributes) {
        fixReturningOptions(options);
        return bulkInsert.call(this, tableName, records, options, attributes);
    };
    /**
     * Updates a row
     */
    queryInterface.update = function (instance, tableName, values, identifier, options) {
        fixReturningOptions(options);
        return update.call(this, instance, tableName, values, identifier, options);
    };
    /**
     * Updates multiple rows at once
     */
    queryInterface.bulkUpdate = function (tableName, values, identifier, options, attributes) {
        fixReturningOptions(options);
        return bulkUpdate.call(this, tableName, values, identifier, options, attributes);
    };
    /**
     * Deletes a row
     */
    queryInterface.delete = function (instance, tableName, identifier, options) {
        fixReturningOptions(options);
        return del.call(this, instance, tableName, identifier, options);
    };
    /**
     * Deletes multiple rows at once
     */
    queryInterface.bulkDelete = function (tableName, identifier, options, model) {
        fixReturningOptions(options);
        return bulkDelete.call(this, tableName, identifier, options, model);
    };
    /**
     * Returns selected rows
     */
    queryInterface.select = function (model, tableName, options) {
        fixReturningOptions(options);
        return select.call(this, model, tableName, options);
    };
    /**
     * Increments a row value
     */
    queryInterface.increment = function (instance, tableName, values, identifier, options) {
        fixReturningOptions(options);
        return increment.call(this, instance, tableName, values, identifier, options);
    };
    /**
     * Selects raw without parsing the string into an object
     */
    queryInterface.rawSelect = function (tableName, options, attributeSelector, model) {
        fixReturningOptions(options);
        return rawSelect.call(this, tableName, options, attributeSelector, model);
    };
    /**
     * Drops view from database
     *
     * @param {string} viewName - view name to drop
     * @param {DropOptions} [options] - drop operation options
     */
    queryInterface.dropView = function (viewName, options = {}) {
        const dropViewSql = `DROP VIEW IF EXISTS "${viewName}"${options.cascade ? ' CASCADE' : ''}`;
        return this.sequelize.query(dropViewSql, this.sequelize.options);
    };
    /**
     * Creates view in a database. Makes sure given view name corresponds to
     * the name inside given create SQL query.
     *
     * @param {string} viewName - view name to create
     * @param {string} viewDefinition - raw sql query to create the view
     */
    queryInterface.createView = function (viewName, viewDefinition) {
        const rx = new RegExp(`\\s*create\\s+(or\\s+replace\\s+)?(temp|temporary\s+)?view\\s+"?${viewName}"?\\s+`, 'i');
        if (!rx.test(viewDefinition)) {
            throw new TypeError('Given view definition does not match given view name');
        }
        return this.sequelize.query(viewDefinition, this.sequelize.options);
    };
    return queryInterface;
}
/**
 * Overriding sequelize behavior to support views
 */
class Sequelize extends sequelize_typescript_1.Sequelize {
    /**
     * Returns an instance of QueryInterface.
     * Supports views.
     *
     * @return {QueryInterface}
     */
    getQueryInterface() {
        const self = this;
        super.getQueryInterface();
        if (typeof self.queryInterface.dropView !== 'function') {
            self.queryInterface = override(self.queryInterface);
        }
        return self.queryInterface;
    }
    /**
     * Overrides original sequelize define method. Supports views.
     *
     * @param {string} modelName
     * @param {ModelAttributes} attributes
     * @param {ModelOptions} [options]
     * @return {typeof BaseModel<TInstance>}
     */
    define(modelName, attributes, options) {
        const opts = options || {};
        opts.modelName = modelName;
        opts.sequelize = this;
        const model = class extends BaseModel {
        };
        model.init(attributes, opts);
        return model;
    }
    /**
     * Sync all defined models to the DB. Including views!
     *
     * @param {SyncOptions} [options]
     * @return {Promise<any>}
     */
    sync(options) {
        const withViews = !options || (options && !options.withNoViews);
        const syncResult = super.sync(options);
        syncResult.then(async (result) => {
            await this.syncIndices(options);
            return result;
        });
        return withViews ? syncResult.then(() => this.syncViews()) : syncResult;
    }
    /**
     * Synchronizes indices defined for models
     *
     * @param {SyncOptions} options
     * @return {Promise<any>}
     */
    syncIndices(options) {
        return Promise.all(this.getModelsWithIndices().map(model => model.syncIndices(options)));
    }
    /**
     * Syncs all defined views to the DB.
     *
     * @return {Promise<any>}
     */
    syncViews() {
        const views = this.getViews();
        return Promise.all(views.map((view) => view.syncView()));
    }
    getModelsWithIndices() {
        const models = [];
        this.modelManager.models.forEach((model) => {
            if (model && model.options &&
                model.options.indices && model.options.indices.length) {
                models.push(model);
            }
        });
        return models;
    }
    /**
     * Returns list of all defined as views models.
     *
     * @return {Array<typeof BaseModel>}
     */
    getViews() {
        const views = [];
        this.modelManager.models.forEach((model) => {
            if (model && model.options && model.options.treatAsView) {
                views.push(model);
            }
        });
        return views;
    }
    /**
     * Overriding native query() method to support { returning: string[] }
     * option for queries in a proper way
     *
     * @param {string | { query: string, values: any[] }} sql
     * @param {QueryOptions} options
     */
    query(sql, options) {
        if (options &&
            Array.isArray(options.returning) &&
            options.returning.length) {
            const sqlText = (typeof sql === 'string' ? sql : sql.query)
                .replace(/returning\s+\*/i, `RETURNING ${options.returning
                .map(field => `"${field}"`).join(', ')}`);
            if (typeof sql === 'string') {
                sql = sqlText;
            }
            else {
                sql.query = sqlText;
            }
        }
        const query = super.query;
        return query.call(this, sql, options).then((entities) => {
            if (!(entities && Array.isArray(entities) && entities.length)) {
                return entities;
            }
            for (const entity of entities) {
                if (entity instanceof BaseModel && options) {
                    // noinspection TypeScriptUnresolvedVariable
                    entity._options.returning = options.returning;
                }
            }
            return entities;
        });
    }
}
exports.Sequelize = Sequelize;
/**
 * Base Model class extends native sequelize Model class
 */
class BaseModel extends sequelize_typescript_1.Model {
    // noinspection JSUnusedGlobalSymbols
    /**
     * Override native drop method to add support of view drops
     *
     * @param {DropOptions} options
     * @return {Promise<any>}
     */
    static drop(options) {
        const self = this;
        const method = self.options && self.options.treatAsView
            ? 'dropView'
            : 'dropTable';
        // noinspection TypeScriptUnresolvedVariable
        return self.QueryInterface[method](self.getTableName(), options);
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Sync this Model to the DB, that is create the table. Upon success, the
     * callback will be called with the model instance (this).
     * Supports views.
     *
     * @param {SyncOptions} [options]
     */
    static sync(options) {
        if (this.options && this.options.treatAsView) {
            // all views skipped until all tables defined
            return Promise.resolve();
        }
        return super.sync(options);
    }
    /**
     * Syncs view to the DB.
     *
     * @param {SyncOptions} [options]
     * @return {Promise<any>}
     */
    static syncView(options) {
        const self = this;
        // noinspection TypeScriptUnresolvedVariable
        return self.QueryInterface.dropView(self.getTableName())
            .then(() => self.QueryInterface.createView(self.getTableName(), self.getViewDefinition()));
    }
    /**
     * Synchronizes configured indices on this model
     *
     * @param {SyncOptions} options
     * @return {Promise<any>}
     */
    static syncIndices(options) {
        const indices = this.options.indices;
        return Promise.all(indices.map((indexOptions, i) => this.syncIndex(indexOptions.column, indexOptions.options, i + 1)));
    }
    /**
     * Builds and executes index definition SQL query for the given
     * column and options. Position is used for auto index naming when
     * index name is auto-generated
     *
     * @param {string} column
     * @param {ColumnIndexOptions} options
     * @param {number} position
     * @return {Promise<any>}
     */
    static syncIndex(column, options, position) {
        const self = this;
        const indexName = options.name ||
            `${this.getTableName()}_${column}_idx${position}`;
        const chain = Promise.resolve(true);
        if (!options.safe) {
            // noinspection TypeScriptUnresolvedVariable
            chain.then(() => self.QueryInterface.sequelize.query(`
                DROP INDEX${options.concurrently
                ? ' CONCURRENTLY' : ''} IF EXISTS "${indexName}"
            `));
        }
        // tslint:disable-next-line:max-line-length
        // noinspection TypeScriptUnresolvedVariable,PointlessBooleanExpressionJS
        chain.then(() => self.QueryInterface.sequelize.query(`
                CREATE${options.unique
            ? ' UNIQUE' : ''} INDEX${options.concurrently
            ? ' CONCURRENTLY' : ''}${options.safe
            ? ' IF NOT EXISTS' : ''} "${indexName}"${options.method
            ? ` USING ${options.method}` : ''} ON "${this.getTableName()}" (${options.expression
            ? `(${options.expression})` : `"${column}"`})${options.collation
            ? ` COLLATE ${options.collation}` : ''}${options.opClass
            ? ` ${options.opClass}` : ''}${options.order
            ? ` ${options.order}` : ''}${options.nullsFirst === true
            ? ' NULLS FIRST' : (options.nullsFirst === false
            ? ' NULLS LAST' : '')}${options.tablespace
            ? ` TABLESPACE ${options.tablespace}` : ''}${options.predicate
            ? ` WHERE ${options.predicate}` : ''}
            `));
        return chain;
    }
    /**
     * Returns view definition SQL string.
     *
     * @return {string}
     */
    static getViewDefinition() {
        return this.options.viewDefinition;
    }
    // Make sure finders executed on views properly map numeric types
    /**
     * Search for multiple instances.
     *
     * @see {Sequelize#query}
     */
    static findAll(options) {
        const method = super.findAll;
        const original = method.call(this, options);
        if (!this.options.treatAsView) {
            return original;
        }
        return original.then((result) => {
            if (result && !Array.isArray(result)) {
                return result.fixNumbers();
            }
            else if (result) {
                result.map((entity) => entity.fixNumbers());
            }
            return result;
        });
    }
    // noinspection JSAnnotator
    /**
     * Search for a single instance by its primary key. This applies LIMIT 1,
     * so the listener will always be called with a single instance.
     */
    static findByPk(identifier, options) {
        const method = super.findByPk;
        const original = method.call(this, identifier, options);
        if (!this.options.treatAsView) {
            return original;
        }
        return original.then((result) => {
            if (result) {
                result.fixNumbers();
            }
            return result;
        });
    }
    // noinspection JSAnnotator
    /**
     * Search for a single instance. This applies LIMIT 1, so the listener will
     * always be called with a single instance.
     */
    static findOne(options) {
        const method = super.findOne;
        const original = method.call(this, options);
        if (!this.options.treatAsView) {
            return original;
        }
        return original.then((result) => {
            if (result) {
                result.fixNumbers();
            }
            return result;
        });
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Restores native serialization state, clearing returning options
     * saved during insert/update query execution
     *
     * @return {BaseModel}
     */
    restoreSerialization() {
        // noinspection TypeScriptUnresolvedVariable
        delete this._options.returning;
        return this;
    }
    /**
     * Appends child node to this entity as if it was joined through query
     *
     * @param {string} name
     * @param {any} data
     * @return {BaseModel}
     */
    appendChild(name, data) {
        // noinspection TypeScriptUnresolvedVariable
        const returning = this._options.returning;
        if (returning && !~returning.indexOf(name)) {
            returning.push(name);
        }
        this[name] = data;
        return this;
    }
    /**
     * Serializes this model instance to JSON
     */
    toJSON() {
        const serialized = toJSON.call(this);
        const props = Object.keys(this);
        // noinspection TypeScriptUnresolvedVariable
        const returning = this._options.returning;
        for (const prop of props) {
            this.verifyProperty(prop, serialized);
        }
        if (Array.isArray(returning)) {
            const serializedProps = Object.keys(serialized);
            for (const prop of serializedProps) {
                if (!~returning.indexOf(prop)) {
                    delete serialized[prop];
                }
            }
        }
        return serialized;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Casts numeric types to numbers for this model if it
     * was not properly done during query selection and mapping.
     * This may occurs sometimes when dealing with Views
     *
     * @return {BaseModel}
     */
    fixNumbers() {
        const model = this.sequelize.models[this.constructor.name];
        const columns = Object.keys(model.rawAttributes);
        for (const column of columns) {
            const value = this[column];
            if (value === undefined) {
                continue;
            }
            const cast = NUMBERS_MAP.get(model.rawAttributes[column].type.constructor.name);
            if (cast) {
                this[column] = cast(value);
            }
        }
        return this;
    }
    /**
     * Makes sure given property properly serialized
     *
     * @access private
     * @param {string} prop
     * @param {any} serialized
     */
    verifyProperty(prop, serialized) {
        // add more skipping props if needed...
        if (~['__eagerlyLoadedAssociations'].indexOf(prop)) {
            return;
        }
        const val = this[prop];
        if (!serialized[prop] && val !== this && val instanceof sequelize_typescript_1.Model) {
            serialized[prop] = toJSON.call(val);
        }
        if (val instanceof Array) {
            this.verifyArray(val, prop, serialized);
        }
    }
    /**
     * Makes sure given array property properly serialized
     *
     * @access private
     * @param {Array<any>} arr
     * @param {string} prop
     * @param {any} serialized
     */
    verifyArray(arr, prop, serialized) {
        if (!serialized[prop]) {
            serialized[prop] = [];
        }
        for (let i = 0; i < arr.length; i++) {
            const val = this[prop][i];
            if (val instanceof sequelize_typescript_1.Model) {
                serialized[prop][i] = toJSON.call(val);
            }
            serialized[prop][i] = val && val.toJSON
                ? val.toJSON()
                : JSON.parse(JSON.stringify(val));
        }
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map