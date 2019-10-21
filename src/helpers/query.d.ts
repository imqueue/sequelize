import { CountOptions } from 'sequelize';
import { FindOptions, IncludeOptions, ModelAttributes } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Literal } from 'sequelize/types/lib/utils';
import { BaseModel } from '../BaseModel';
import { FieldsInput, OrderByInput, PaginationInput } from '../types';
export declare namespace query {
    interface PureDataFunction {
        <M extends Model<M>, T>(model: typeof Model, input: T, attributes?: string[]): ModelAttributes;
        <M extends Model<M>, T>(model: typeof Model, input: T[], attributes?: string[]): ModelAttributes[];
    }
    /**
     * Performs safe trimming space characters inside SQL query input string
     * and inline it.
     *
     * @param {string} input - input string
     * @return {string} - sanitized string
     */
    export function safeSqlSpaceCleanup(input: string): string;
    /**
     * SQL tag used to tag sql queries
     *
     * @param {string | TemplateStringsArray} sqlQuery
     * @param {...any[]} [rest] - anything else
     * @return {string}
     */
    export function sql(sqlQuery: string | TemplateStringsArray, ...rest: any[]): string;
    /**
     * Extracts pure data from given input data for a given model
     *
     * @param {typeof Model} model
     * @param {any | any[]} input
     * @param {string[]} [attributes]
     * @return {M}
     */
    export const pureData: PureDataFunction;
    /**
     * Omits non-related properties from a given fields map object associated
     * with the given model
     *
     * @param {typeof Model} model
     * @param {any} fields
     * @return {string[]}
     */
    export function pureFields(model: typeof BaseModel, fields: any): string[] | true;
    /**
     * Returns true if given fields contains associations from given model,
     * false otherwise
     *
     * @param {typeof Model} model
     * @param {any} fields
     * @return {boolean}
     */
    export function needNesting(model: typeof Model, fields: any): boolean;
    /**
     * Returns list of filtered attributes from model through a given list of
     * user requested fields
     *
     * @param {any} attributes
     * @param {string[]} fields
     * @param {typeof BaseModel} [model]
     * @return {string[]}
     */
    export function filtered(attributes: any, fields: string[], model?: typeof BaseModel): string[];
    /**
     * Extracts foreign keys existing on the given model for a given list of
     * associations and returns as field names list
     *
     * @param {typeof BaseModel} model
     * @param {string[]} relations
     * @return {string[]}
     */
    export function foreignKeys(model: typeof BaseModel, relations: string[]): string[];
    /**
     * Makes sure all merge arguments are merged into a given query
     *
     * @param {any} [queryOptions]
     * @param {...any[]} merge
     * @return - merged query options
     */
    export function mergeQuery(queryOptions?: any, ...merge: any[]): any;
    /**
     * Automatically map query joins and requested attributes from a given
     * fields map to a given model and returns query find options. Additionally
     * will merge all given options as the rest arguments.
     *
     * @param {Model} model - model to build query for
     * @param {any} fields - map of the fields requested by a user or a list
     *                       of fields for a root object (without associations)
     * @param {...Array<Partial<T> | undefined>} merge - other query parts to
     *                                                   merge with
     * @return {T} - query options type specified by a call
     */
    export function autoQuery<T>(model: any, fields?: any, ...merge: Array<Partial<T> | undefined>): T;
    /**
     * Return names of primary key fields for a given model.
     *
     * @param {typeof BaseModel} model
     * @return {string[]}
     */
    export function primaryKeys(model: typeof BaseModel): string[];
    /**
     * Foreign key map representation, where related property name references
     * parent property name.
     *
     * @type {ForeignKeyMap}
     * @access private
     */
    interface ForeignKeyMap {
        [property: string]: string;
    }
    /**
     * Returns foreign key map for a given pair of parent model and related
     * model.
     *
     * @param {typeof BaseModel} parent
     * @param {typeof BaseModel} model
     * @return {ForeignKeyMap}
     * @access private
     */
    export function foreignKeysMap(parent: typeof BaseModel, model: typeof BaseModel): ForeignKeyMap | null;
    /**
     * Recursively creates entity and all it's relations from a given input
     * using a given model.
     *
     * @param {T} model - model class to map entity to
     * @param {I} input - data input object related to a given model
     * @param {FieldsInput} [fields] - fields map to return on created entity
     * @return {Promise<Partial<T>>}
     */
    export function createEntity<T extends BaseModel<T>, I>(model: typeof BaseModel, input: I, fields?: FieldsInput): Promise<Partial<T>>;
    /**
     * Builds and returns count query for a given query options and model.
     *
     * @param {Model} model
     * @param {any} fields
     * @param {Array<Partial<CountOptions> | undefined>} merge
     * @return {CountOptions}
     */
    export function autoCountQuery(model: any, fields?: any, ...merge: Array<Partial<CountOptions> | undefined>): CountOptions;
    /**
     * Builds proper paging options query part
     *
     * @param {PaginationInput} [pageOptions] - obtained pagination input
     *                                          from remote
     * @return {FindOptions} - pagination part of the query
     */
    export function toLimitOptions<T>(pageOptions?: PaginationInput): FindOptions;
    /**
     * Constructs order by part of the query from a given input orderBy object
     *
     * @param {any} orderBy
     */
    export function toOrderOptions<T>(orderBy?: OrderByInput): FindOptions;
    /**
     * Adds or null check to a given where field values
     *
     * @param {string | string[]} value
     * @return {FindOptions}
     */
    export function orNull(value: string | string[]): Partial<FindOptions>;
    /**
     * Builds toWhereOptions clause query sub-part for a given filter type
     *
     * @param {T} filter
     * @return {any} - toWhereOptions clause options
     */
    export function toWhereOptions<T>(filter?: T): any;
    /**
     * Will apply a range rule on a given filters. The rule is simple. If
     * filter query contains fields named as [ColumnName]IRange it will try to
     * convert those fields to a proper range filter if the value is a proper
     * RangeFilter interface as { start: something, end: something }
     * If nothing is matched will simply ignores and keep filtering props
     * as them are.
     *
     * @param {any} filter
     * @return {any}
     */
    export function withRangeFilters(filter: any): any;
    /**
     * Looks up and returns include options in a given query using an array of
     * given models as a search path
     *
     * @param {FindOptions} queryOptions
     * @param {Array<typeof Model>} path
     * @return {IncludeOptions | null}
     */
    export function getInclude(queryOptions: FindOptions, path: Array<typeof Model>): IncludeOptions | null;
    /**
     * Returns sequelize Literal build from a given string or string template
     * Actually it's an alias for Sequelize.Literal
     *
     * @example
     * ```typescript
     * const owner = 3;
     * const query = {
     *   where: L`(SELECT COUNT(*) FROM "SomeTable" WHERE owner = ${E(id)}) = 0`
     * }
     * ```
     * @param {TemplateStringsArray | string} str
     * @return {Literal}
     */
    export function L(str: TemplateStringsArray | string, ..._: any[]): Literal;
    /**
     * Escapes given argument. If argument is not a number or a string will
     * convert it to 'NULL'
     *
     * @param {any} input
     * @return {string | number}
     */
    export function E(input: any): string | number;
    /**
     * Removes given properties from the given object
     *
     * @param {any} obj
     * @param {...string[]} props
     * @return {any}
     */
    export function skip(obj: any, ...props: string[]): any;
    /**
     * Traverses given query object, lookups for includes matching
     * the given arguments of include options and overrides those are matching
     * by model and alias with the provided option.
     *
     * @param {FindOptions | CountOptions} queryOptions
     * @param {...IncludeOptions[]} options
     * @return {FindOptions | CountOptions}
     */
    export function overrideJoin(queryOptions: FindOptions | CountOptions, ...options: IncludeOptions[]): FindOptions | CountOptions;
    export {};
}
