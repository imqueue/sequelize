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
import Promise = require('bluebird');
import { BuildOptions as BuildOptionsOrigin, BulkCreateOptions as BulkCreateOptionsOrigin, CreateOptions as CreateOptionsOrigin, DropOptions, FindOptions, Identifier, ModelAttributes, ModelOptions, QueryInterface as QueryInterfaceOrigin, QueryOptions as QueryOptionsOrigin, QueryOptionsWithType, SaveOptions as InstanceSaveOptionsOrigin, SyncOptions as SyncOptionsOrigin, UpdateOptions as UpdateOptionsOrigin, UpsertOptions as UpsertOptionsOrigin } from 'sequelize';
import { Model, Sequelize as SequelizeOrigin } from 'sequelize-typescript';
import QueryTypes = require('sequelize/types/lib/query-types');
import { ColumnIndexOptions } from './decorators/index';
export declare type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
/**
 * Extends original SyncOptions from Sequelize to add view support
 */
export interface SyncOptions extends SyncOptionsOrigin {
    treatAsView?: boolean;
    withNoViews?: boolean;
}
export interface ReturningOptions {
    returning?: boolean | string[];
}
export declare type IModelClass<T extends BaseModel<T>> = new () => T;
export declare type UpsertOptions = Modify<UpsertOptionsOrigin, ReturningOptions>;
export declare type BuildOptions = Modify<BuildOptionsOrigin, ReturningOptions>;
export declare type BulkCreateOptions = Modify<BulkCreateOptionsOrigin, ReturningOptions>;
export declare type QueryOptions = Modify<QueryOptionsOrigin, ReturningOptions>;
export declare type UpdateOptions = Modify<UpdateOptionsOrigin, ReturningOptions>;
export declare type CreateOptions = Modify<CreateOptionsOrigin, ReturningOptions>;
export declare type SaveOptions = Modify<InstanceSaveOptionsOrigin, ReturningOptions>;
/**
 * Extends original QueryInterface from sequelize to add support of create/drop
 * views.
 */
export interface QueryInterface extends QueryInterfaceOrigin {
    sequelize: Sequelize;
    dropView(viewName: string, options?: DropOptions): Promise<any>;
    createView(viewName: string, viewDefinition: string): Promise<any>;
}
/**
 * Overriding sequelize behavior to support views
 */
export declare class Sequelize extends SequelizeOrigin {
    /**
     * Returns an instance of QueryInterface.
     * Supports views.
     *
     * @return {QueryInterface}
     */
    getQueryInterface(): QueryInterface;
    /**
     * Overrides original sequelize define method. Supports views.
     *
     * @param {string} modelName
     * @param {ModelAttributes} attributes
     * @param {ModelOptions} [options]
     * @return {typeof BaseModel<TInstance>}
     */
    define<TInstance, TAttributes>(modelName: string, attributes: ModelAttributes, options?: ModelOptions): any;
    /**
     * Sync all defined models to the DB. Including views!
     *
     * @param {SyncOptions} [options]
     * @return {Promise<any>}
     */
    sync(options?: SyncOptions): Promise<any>;
    /**
     * Synchronizes indices defined for models
     *
     * @param {SyncOptions} options
     * @return {Promise<any>}
     */
    syncIndices(options?: SyncOptions): Promise<any>;
    /**
     * Syncs all defined views to the DB.
     *
     * @return {Promise<any>}
     */
    syncViews(): Promise<any>;
    getModelsWithIndices(): (typeof BaseModel)[];
    /**
     * Returns list of all defined as views models.
     *
     * @return {Array<typeof BaseModel>}
     */
    getViews(): Array<typeof BaseModel>;
    /**
     * Overriding native query() method to support { returning: string[] }
     * option for queries in a proper way
     *
     * @param {string | { query: string, values: any[] }} sql
     * @param {QueryOptions} options
     */
    query(sql: string | {
        query: string;
        values: any[];
    }, options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>): Promise<any>;
}
/**
 * Base Model class extends native sequelize Model class
 */
export declare abstract class BaseModel<T> extends Model<BaseModel<T>> {
    /**
     * Override native drop method to add support of view drops
     *
     * @param {DropOptions} options
     * @return {Promise<any>}
     */
    static drop(options?: DropOptions): Promise<any>;
    /**
     * Sync this Model to the DB, that is create the table. Upon success, the
     * callback will be called with the model instance (this).
     * Supports views.
     *
     * @param {SyncOptions} [options]
     */
    static sync(options?: SyncOptions): Promise<any>;
    /**
     * Syncs view to the DB.
     *
     * @param {SyncOptions} [options]
     * @return {Promise<any>}
     */
    static syncView(options?: SyncOptions): Promise<any>;
    /**
     * Synchronizes configured indices on this model
     *
     * @param {SyncOptions} options
     * @return {Promise<any>}
     */
    static syncIndices(options?: SyncOptions): Promise<any>;
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
    static syncIndex(column: string, options: ColumnIndexOptions, position: number): Promise<boolean>;
    /**
     * Returns view definition SQL string.
     *
     * @return {string}
     */
    static getViewDefinition(): any;
    /**
     * Search for multiple instances.
     *
     * @see {Sequelize#query}
     */
    static findAll<M>(options?: FindOptions): Promise<M[]>;
    /**
     * Search for a single instance by its primary key. This applies LIMIT 1,
     * so the listener will always be called with a single instance.
     */
    static findByPk<M>(identifier?: Identifier, options?: Omit<FindOptions, 'where'>): Promise<M | null>;
    /**
     * Search for a single instance. This applies LIMIT 1, so the listener will
     * always be called with a single instance.
     */
    static findOne<M>(options?: FindOptions): Promise<M | null>;
    /**
     * Restores native serialization state, clearing returning options
     * saved during insert/update query execution
     *
     * @return {BaseModel}
     */
    restoreSerialization(): this;
    /**
     * Appends child node to this entity as if it was joined through query
     *
     * @param {string} name
     * @param {any} data
     * @return {BaseModel}
     */
    appendChild(name: string, data: any): this;
    /**
     * Serializes this model instance to JSON
     */
    toJSON(): any;
    /**
     * Casts numeric types to numbers for this model if it
     * was not properly done during query selection and mapping.
     * This may occurs sometimes when dealing with Views
     *
     * @return {BaseModel}
     */
    fixNumbers(): BaseModel<T>;
    /**
     * Makes sure given property properly serialized
     *
     * @access private
     * @param {string} prop
     * @param {any} serialized
     */
    private verifyProperty;
    /**
     * Makes sure given array property properly serialized
     *
     * @access private
     * @param {Array<any>} arr
     * @param {string} prop
     * @param {any} serialized
     */
    private verifyArray;
}
