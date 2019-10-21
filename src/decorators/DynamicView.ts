/*!
 * Copyright (c) 2019 WAYV <mike@wayv.com>
 *
 * This software is private and is unlicensed. Please, contact
 * author for any licensing details.
 */
import 'reflect-metadata';
import { addOptions, setModelName } from 'sequelize-typescript';
import { IViewDefineOptions } from './View';

/**
 * Key/Value parameter store
 */
export interface ViewParams {
    [name: string]: string;
}
export interface IDynamicViewDefineOptions extends IViewDefineOptions {
    viewParams: ViewParams;
    viewDefinition: string;
    isDynamicView?: boolean;
}

export const MATCHER = '@\\{([a-z0-9_]+?)\\}';
export const RX_MATCHER = new RegExp(MATCHER, 'gi');
export const RX_NAME_MATCHER = new RegExp(MATCHER, 'i');

// noinspection JSUnusedGlobalSymbols
/**
 * Decorator factory: @View
 *
 * Adding view support for sequelize models, making sure views
 * could be defined in a safe way without a problems with sync/drop ops, etc.
 * This decorator simply annotate a model entity the same way @Table does,
 * adding extra option "treatAsView" which is utilized by a BaseModel
 * class to override native behavior of sequelize models.
 *
 * @param {IViewDefineOptions | string} options - view definition options
 * @return {() => any} - view annotation decorator
 */
export function DynamicView(
    options: IDynamicViewDefineOptions,
) {
    if (!options || !options.viewDefinition.trim()) {
        throw new TypeError('View definition is missing!');
    }

    // we are dynamic, no choice here!
    options.isDynamicView = true;

    const viewDef = options.viewDefinition || '';
    const viewParams = options.viewParams || {};

    (viewDef.match(RX_MATCHER) || []).forEach(param => {
        const [_, name] = (param.match(RX_NAME_MATCHER) || ['', '']);

        if (typeof viewParams[name] !== 'string') {
            throw new TypeError(
                `View definition contains param '${
                    name}', but it was not provided`,
            );
        }
    });

    return (target: any) => annotate(target, options as IViewDefineOptions);
}

/**
 * Does the job to define the view table
 *
 * @param {any} target - model class
 * @param {IViewDefineOptions} options - view definition options
 */
function annotate(target: any, options: IViewDefineOptions): void {
    Object.assign(options, { treatAsView: true });

    setModelName(target.prototype, options.modelName || target.name);
    addOptions(target.prototype, options);
}
