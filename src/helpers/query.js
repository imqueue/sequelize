"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
const sequelize_1 = require("sequelize");
const __1 = require("..");
const BaseModel_1 = require("../BaseModel");
const types_1 = require("../types");
var query;
(function (query) {
    var isObject = js_1.js.isObject;
    var isArray = js_1.js.isArray;
    const RX_OP = /^\$/;
    const RX_LIKE = /%/;
    const RX_LTE = /^<=/;
    const RX_GTE = /^>=/;
    const RX_LT = /^</;
    const RX_GT = /^>/;
    const RX_EQ = /^=/;
    const RX_RANGE = /Range$/;
    const RX_SPACE = /\s/;
    const RX_SQL_CLEAN = /\s+(;|$)/;
    const RX_SQL_END = /;?$/;
    /**
     * Performs safe trimming space characters inside SQL query input string
     * and inline it.
     *
     * @param {string} input - input string
     * @return {string} - sanitized string
     */
    function safeSqlSpaceCleanup(input) {
        let output = '';
        let opened = false;
        let space = false;
        for (const char of input) {
            if (!opened && RX_SPACE.test(char)) {
                if (!space) {
                    output += ' ';
                }
                space = true;
            }
            else {
                output += char;
                space = false;
            }
            if (char === '\'') {
                opened = !opened;
            }
        }
        return output;
    }
    query.safeSqlSpaceCleanup = safeSqlSpaceCleanup;
    // tslint:disable-next-line:max-line-length
    // noinspection JSUnusedGlobalSymbols
    /**
     * SQL tag used to tag sql queries
     *
     * @param {string | TemplateStringsArray} sqlQuery
     * @param {...any[]} [rest] - anything else
     * @return {string}
     */
    function sql(sqlQuery, ...rest) {
        return safeSqlSpaceCleanup(String(sqlQuery))
            .replace(RX_SQL_CLEAN, '')
            .replace(RX_SQL_END, ';');
    }
    query.sql = sql;
    /**
     * Extracts pure data from given input data for a given model
     *
     * @param {typeof Model} model
     * @param {any | any[]} input
     * @param {string[]} [attributes]
     * @return {M}
     */
    query.pureData = (model, input, attributes) => {
        attributes = attributes || Object.keys(model.rawAttributes || {});
        if (isArray(input)) {
            return input.map(inputItem => query.pureData(model, inputItem, attributes));
        }
        return Object.keys(input).reduce((res, prop) => {
            if (~attributes.indexOf(prop)) {
                res[prop] = input[prop];
            }
            return res;
        }, {});
    };
    // noinspection JSUnusedGlobalSymbols
    /**
     * Omits non-related properties from a given fields map object associated
     * with the given model
     *
     * @param {typeof Model} model
     * @param {any} fields
     * @return {string[]}
     */
    function pureFields(model, fields) {
        if (!fields) {
            return true;
        }
        const attributes = Object.keys(model.rawAttributes || {});
        const list = Object.keys(Object.keys(fields).reduce((res, prop) => {
            if (~attributes.indexOf(prop)) {
                res[prop] = fields[prop];
            }
            return res;
        }, {}));
        // make sure it contains primary key fields
        // that's a tiny trade-off to make sure we won't loose it for a domain
        // logic to use
        primaryKeys(model).forEach(fieldName => !~list.indexOf(fieldName) && list.push(fieldName));
        return list;
    }
    query.pureFields = pureFields;
    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns true if given fields contains associations from given model,
     * false otherwise
     *
     * @param {typeof Model} model
     * @param {any} fields
     * @return {boolean}
     */
    function needNesting(model, fields) {
        if (!fields) {
            return false;
        }
        const associations = Object.keys(model.associations || {});
        const properties = Object.keys(fields);
        if (!associations.length) {
            return false;
        }
        return associations.some(name => !!~properties.indexOf(name));
    }
    query.needNesting = needNesting;
    /**
     * Returns list of filtered attributes from model through a given list of
     * user requested fields
     *
     * @param {any} attributes
     * @param {string[]} fields
     * @param {typeof BaseModel} [model]
     * @return {string[]}
     */
    function filtered(attributes, fields, model) {
        let filteredAttributes = (attributes
            ? Object.keys(attributes).filter(attr => ~fields.indexOf(attr))
            : []);
        if (!filteredAttributes.length && model) {
            filteredAttributes = primaryKeys(model);
        }
        return filteredAttributes;
    }
    query.filtered = filtered;
    /**
     * Extracts foreign keys existing on the given model for a given list of
     * associations and returns as field names list
     *
     * @param {typeof BaseModel} model
     * @param {string[]} relations
     * @return {string[]}
     */
    function foreignKeys(model, relations) {
        const associations = model.associations || {};
        return relations.map((name) => {
            const association = (associations[name] || {});
            if (association.source === model &&
                association.foreignKey && (!(association.sourceKey ||
                association.associationType === 'BelongsToMany'))) {
                return association.foreignKey;
            }
            return null;
        })
            .filter(idField => idField) || [];
    }
    query.foreignKeys = foreignKeys;
    /**
     * Merges given arrays of scalars making sure they contains unique values
     *
     * @param {any[][]} args
     * @return {any[]}
     */
    function arrayMergeUnique(...args) {
        const result = [];
        for (const arr of args) {
            result.push(...arr);
        }
        return result.filter((item, index) => result.indexOf(item) === index);
    }
    /**
     * Makes sure all merge arguments are merged into a given query
     *
     * @param {any} [queryOptions]
     * @param {...any[]} merge
     * @return - merged query options
     */
    function mergeQuery(queryOptions = {}, ...merge) {
        for (const item of merge) {
            if (!item) {
                continue;
            }
            for (const prop of Object.keys(item)) {
                const err = `Given ${prop} option is invalid!`;
                if (typeof queryOptions[prop] === 'undefined') {
                    queryOptions[prop] = item[prop];
                    continue;
                }
                if (typeof item[prop] === 'undefined') {
                    continue;
                }
                if (isArray(queryOptions[prop])) {
                    if (!isArray(item[prop])) {
                        throw new TypeError(err);
                    }
                    for (const element of item[prop]) {
                        if (!~queryOptions[prop].indexOf(element)) {
                            queryOptions[prop].push(element);
                        }
                    }
                    continue;
                }
                if (isObject(queryOptions[prop])) {
                    if (!isObject(item[prop])) {
                        throw new TypeError(err);
                    }
                    Object.assign(queryOptions[prop], item[prop]);
                    continue;
                }
                queryOptions[prop] = item[prop];
            }
        }
        return queryOptions;
    }
    query.mergeQuery = mergeQuery;
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
    function autoQuery(model, fields, ...merge) {
        const queryOptions = {};
        const { order } = merge.find((item) => item && !!item.order) ||
            {};
        if (order && isArray(order)) {
            // make sure order arg will not break selection
            for (const [field] of order) {
                if (fields && typeof fields[field] === 'undefined') {
                    fields[field] = false;
                }
            }
        }
        if (isArray(fields)) {
            queryOptions.attributes = filtered(model.rawAttributes, fields, model);
        }
        else if (fields) {
            const fieldNames = Object.keys(fields);
            // relations which are requested by a user
            const relations = filtered(model.associations, fieldNames);
            // attributes which are requested by a user
            queryOptions.attributes = arrayMergeUnique(filtered(model.rawAttributes, fieldNames, model), foreignKeys(model, relations));
            // we may want to check if the given field is being filtered
            // and build where clause for it
            Object.assign(queryOptions, toWhereOptions(queryOptions.attributes.reduce((res, attr) => {
                if (fields[attr] !== false) {
                    res[attr] = fields[attr];
                }
                return res;
            }, {})));
            if (relations.length) {
                queryOptions.include = [];
                for (const rel of relations) {
                    const relModel = model.associations[rel].target;
                    // noinspection TypeScriptUnresolvedVariable
                    queryOptions.include.push(Object.assign({ model: relModel, as: model.associations[rel].options.as }, autoQuery(relModel, fields[rel])));
                }
            }
        }
        if (merge.length) {
            mergeQuery(queryOptions, ...merge);
        }
        return queryOptions;
    }
    query.autoQuery = autoQuery;
    /**
     * Return names of primary key fields for a given model.
     *
     * @param {typeof BaseModel} model
     * @return {string[]}
     */
    function primaryKeys(model) {
        const fields = model.rawAttributes;
        return Object.keys(fields).filter(name => fields[name].primaryKey);
    }
    query.primaryKeys = primaryKeys;
    /**
     * Returns foreign key map for a given pair of parent model and related
     * model.
     *
     * @param {typeof BaseModel} parent
     * @param {typeof BaseModel} model
     * @return {ForeignKeyMap}
     * @access private
     */
    function foreignKeysMap(parent, model) {
        let found = false;
        const map = Object.keys(model.rawAttributes)
            .reduce((fkMap, name) => {
            const relation = model.rawAttributes[name].references;
            if (relation &&
                relation.model === parent.name && relation.key) {
                fkMap[name] = relation.key;
                found = true;
            }
            return fkMap;
        }, {});
        return found ? map : null;
    }
    query.foreignKeysMap = foreignKeysMap;
    /**
     * Prepares input for a given model and builds found relation arguments
     *
     * @access private
     * @param {any} input
     * @param {string[]} relations
     * @param {typeof BaseModel} model
     * @param {FieldsInput} [fields]
     * @param {Transaction} [transaction]
     * @param {T} [parent]
     * @return {RelationArgs}
     */
    function prepareInput(input, relations, model, fields, transaction, parent) {
        const args = [];
        for (const relation of relations) {
            args.push([
                model.associations[relation].target,
                input[relation],
                fields ? fields[relation] : undefined,
                transaction,
                relation,
            ]);
            delete input[relation];
        }
        if (parent) {
            const foreignKey = foreignKeysMap(parent.constructor, model);
            foreignKey && Object.keys(foreignKey).forEach(property => {
                if (!input[property]) {
                    input[property] = parent[foreignKey[property]];
                }
            });
        }
        return args;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Recursively creates entity and all it's relations from a given input
     * using a given model.
     *
     * @param {T} model - model class to map entity to
     * @param {I} input - data input object related to a given model
     * @param {FieldsInput} [fields] - fields map to return on created entity
     * @return {Promise<Partial<T>>}
     */
    async function createEntity(model, input, fields) {
        return await doCreateEntity(model, input, fields);
    }
    query.createEntity = createEntity;
    /**
     * Recursively creates entity and all it's relations from a given input
     * using a given model.
     *
     * @param {T} model
     * @param {I | I[]} input
     * @param {FieldsInput} [fields]
     * @param {Transaction} [transaction]
     * @param {string} [parentProperty]
     * @param {boolean} [noAppend]
     * @param {T} parent
     * @return {Promise<Partial<T>>}
     * @access private
     */
    async function doCreateEntity(model, input, fields, transaction, parentProperty, parent, noAppend = false) {
        transaction = transaction || await __1.database().transaction({
            autocommit: false,
        });
        // todo: this could be optimized through bulk operations
        if (isArray(input) && parentProperty && parent) {
            parent.appendChild(parentProperty, await Promise.all(input.map(inputItem => doCreateEntity(model, inputItem, fields, transaction, parentProperty, parent, true))));
            return parent;
        }
        if (fields) {
            primaryKeys(model).forEach(name => !fields[name] && (fields[name] = false));
        }
        const fieldNames = Object.keys(input);
        const relationArgs = prepareInput(input, filtered(model.associations, fieldNames), model, fields, transaction, parent);
        const entity = new model(input);
        await entity.save({
            transaction,
            returning: fields
                ? filtered(model.rawAttributes, Object.keys(fields), model)
                : true,
        });
        if (!noAppend && parentProperty && parent) {
            parent.appendChild(parentProperty, entity);
        }
        await Promise.all(relationArgs.map(async (args) => {
            args.push(entity);
            await doCreateEntity(...args);
        }));
        if (!parent) {
            await transaction.commit();
        }
        return entity;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Builds and returns count query for a given query options and model.
     *
     * @param {Model} model
     * @param {any} fields
     * @param {Array<Partial<CountOptions> | undefined>} merge
     * @return {CountOptions}
     */
    function autoCountQuery(model, fields, ...merge) {
        const queryOptions = autoQuery(model, fields, ...merge);
        if (queryOptions.attributes) {
            delete queryOptions.attributes;
        }
        return queryOptions;
    }
    query.autoCountQuery = autoCountQuery;
    // noinspection JSUnusedGlobalSymbols
    /**
     * Builds proper paging options query part
     *
     * @param {PaginationInput} [pageOptions] - obtained pagination input
     *                                          from remote
     * @return {FindOptions} - pagination part of the query
     */
    function toLimitOptions(pageOptions) {
        const page = {};
        if (!pageOptions || !+pageOptions.limit) {
            return page;
        }
        page.offset = 0;
        page.limit = 0;
        const count = pageOptions.count || 0;
        if (pageOptions.offset) {
            page.offset = pageOptions.offset;
        }
        if (pageOptions.limit) {
            page.limit = Math.abs(pageOptions.limit);
        }
        if (pageOptions.limit < 0) {
            if (page.offset === 0) {
                page.offset = count - page.limit;
            }
            if (page.offset < 0) {
                page.offset = 0;
            }
        }
        return page;
    }
    query.toLimitOptions = toLimitOptions;
    /**
     * Ensures order by value is correct or returns default (ASC) if not. This
     * would prevent from any possible injections or errors.
     *
     * @param {any} value
     * @return {OrderDirection}
     */
    function toOrderDirection(value) {
        if (String(value).toLocaleLowerCase() === 'desc') {
            return types_1.OrderDirection.desc;
        }
        else {
            return types_1.OrderDirection.asc;
        }
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Constructs order by part of the query from a given input orderBy object
     *
     * @param {any} orderBy
     */
    function toOrderOptions(orderBy) {
        const order = {};
        if (!orderBy) {
            return order;
        }
        const fields = Object.keys(orderBy);
        if (!fields.length) {
            return order;
        }
        order.order = [];
        for (const field of fields) {
            order.order.push([field, toOrderDirection(orderBy[field])]);
        }
        return order;
    }
    query.toOrderOptions = toOrderOptions;
    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds or null check to a given where field values
     *
     * @param {string | string[]} value
     * @return {FindOptions}
     */
    function orNull(value) {
        if (isArray(value)) {
            return { [sequelize_1.Op.or]: [null, ...value] };
        }
        return { [sequelize_1.Op.or]: [null, value] };
    }
    query.orNull = orNull;
    /**
     * Rich filters implementation. Actually by doing this we allow outside
     * calls to replicate what sequelize does for us: building rich where
     * clauses.
     *
     * @param {FilterInput} filter
     * @return {FindOptions}
     */
    function parseFilter(filter) {
        const clause = {};
        if (Object.prototype.toString.call(filter) === '[object Object]') {
            for (const op of Object.keys(filter)) {
                if (types_1.FILTER_OPS[op]) {
                    clause[types_1.FILTER_OPS[op]] = parseFilter(filter[op]);
                }
                else {
                    clause[op] = parseFilter(filter[op]);
                }
            }
        }
        else {
            // that's recursive value reached
            return filter;
        }
        return clause;
    }
    /**
     * This gives us an ability to simulate ILIKE, <, >, <=, >=, = right withing
     * given values in the filter.
     *
     * @param {string} prop
     * @param {any} data
     * @return {IFindOptions<T>>}
     */
    function parseFilterValue(prop, data) {
        const value = { [prop]: data };
        if (typeof data !== 'string') {
            return value;
        }
        if (RX_LIKE.test(data)) {
            value[prop] = { [sequelize_1.Op.iLike]: data };
        }
        else if (RX_GTE.test(data)) {
            value[prop] = { [sequelize_1.Op.gte]: parseValue(data.replace(RX_GTE, '')) };
        }
        else if (RX_GT.test(data)) {
            value[prop] = { [sequelize_1.Op.gt]: parseValue(data.replace(RX_GT, '')) };
        }
        else if (RX_LTE.test(data)) {
            value[prop] = { [sequelize_1.Op.lte]: parseValue(data.replace(RX_LTE, '')) };
        }
        else if (RX_LT.test(data)) {
            value[prop] = { [sequelize_1.Op.lt]: parseValue(data.replace(RX_LT, '')) };
        }
        else if (RX_EQ.test(data)) {
            value[prop] = { [sequelize_1.Op.eq]: parseValue(data.replace(RX_EQ, '')) };
        }
        return value;
    }
    /**
     * Parses a given value
     * @param value
     */
    function parseValue(value) {
        try {
            const date = new Date(value);
            if (date.toISOString() === value) {
                return date;
            }
        }
        catch (err) { /* not a date */ }
        return ((+value + '') === value) ? +value : value;
    }
    /**
     * Builds toWhereOptions clause query sub-part for a given filter type
     *
     * @param {T} filter
     * @return {any} - toWhereOptions clause options
     */
    function toWhereOptions(filter) {
        if (!filter) {
            return {};
        }
        const options = {};
        for (const prop of Object.keys(filter)) {
            let data = filter[prop];
            if (isArray(data)) {
                if (data.length === 0) {
                    continue;
                }
                if (data.length === 1) {
                    data = data[0];
                }
            }
            if (data === undefined) {
                continue;
            }
            options.where = options.where || {};
            if (RX_OP.test(prop)) {
                Object.assign(options.where, parseFilter({ [prop]: data, }));
            }
            else if (data && data.start && data.end) { // range filter
                Object.assign(options.where, {
                    [prop]: { [sequelize_1.Op.between]: [data.start, data.end] },
                });
            }
            else if (Object.prototype.toString.call(data) === '[object Object]') {
                Object.assign(options.where, { [prop]: parseFilter(data) });
            }
            else if (isArray(data)) {
                Object.assign(options.where, { [prop]: { [sequelize_1.Op.in]: data } });
            }
            else {
                Object.assign(options.where, parseFilterValue(prop, data));
            }
        }
        return options;
    }
    query.toWhereOptions = toWhereOptions;
    // noinspection JSUnusedGlobalSymbols
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
    function withRangeFilters(filter) {
        if (!filter) {
            return filter;
        }
        for (const prop of Object.keys(filter)) {
            const col = prop.replace(RX_RANGE, '');
            if (col === prop) { // not a range filter
                if (isObject(filter[prop])) {
                    withRangeFilters(filter[prop]);
                }
                continue;
            }
            const signature = Object.keys(filter[prop]) + '';
            if (!~['start,end', 'end,start'].indexOf(signature)) {
                continue; // not a range filter signature
            }
            if (filter[col]) {
                throw new TypeError(`Only one of filtering options "${col}" or "${prop}" can be passed as filtering option!`);
            }
            filter[col] = filter[prop];
            delete filter[prop];
        }
        return filter;
    }
    query.withRangeFilters = withRangeFilters;
    // noinspection JSUnusedGlobalSymbols
    /**
     * Looks up and returns include options in a given query using an array of
     * given models as a search path
     *
     * @param {FindOptions} queryOptions
     * @param {Array<typeof Model>} path
     * @return {IncludeOptions | null}
     */
    function getInclude(queryOptions, path) {
        const currentModel = path.shift();
        for (const include of (queryOptions.include || [])) {
            const model = include.model;
            // noinspection TypeScriptValidateTypes
            if (model === currentModel) {
                if (!path.length) {
                    return include;
                }
                else {
                    return getInclude(include, path);
                }
            }
        }
        return null;
    }
    query.getInclude = getInclude;
    // noinspection JSUnusedLocalSymbols,JSCommentMatchesSignature
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
    function L(str, ..._) {
        return BaseModel_1.Sequelize.literal(str);
    }
    query.L = L;
    /**
     * Escapes given argument. If argument is not a number or a string will
     * convert it to 'NULL'
     *
     * @param {any} input
     * @return {string | number}
     */
    function E(input) {
        if (typeof input === 'number') {
            return +input;
        }
        if (typeof input === 'string') {
            return `'${input}'`;
        }
        return 'NULL';
    }
    query.E = E;
    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes given properties from the given object
     *
     * @param {any} obj
     * @param {...string[]} props
     * @return {any}
     */
    function skip(obj, ...props) {
        if (!obj) {
            return obj;
        }
        for (const prop of props) {
            delete obj[prop];
        }
        return obj;
    }
    query.skip = skip;
    // noinspection JSUnusedGlobalSymbols
    /**
     * Traverses given query object, lookups for includes matching
     * the given arguments of include options and overrides those are matching
     * by model and alias with the provided option.
     *
     * @param {FindOptions | CountOptions} queryOptions
     * @param {...IncludeOptions[]} options
     * @return {FindOptions | CountOptions}
     */
    function overrideJoin(queryOptions, ...options) {
        if (!(queryOptions && queryOptions.include) || !options.length) {
            return queryOptions;
        }
        for (let _a of options) {
            const { model } = _a, fields = __rest(_a, ["model"]);
            let found = false;
            for (const include of queryOptions.include) {
                const as = fields.as;
                if (include === model || (include.model === model && (!as || as === include.as))) {
                    Object.assign(include, fields);
                    found = true;
                }
            }
            if (!found) {
                queryOptions.include.push(Object.assign({ model }, fields));
            }
        }
        return queryOptions;
    }
    query.overrideJoin = overrideJoin;
})(query = exports.query || (exports.query = {}));
//# sourceMappingURL=query.js.map