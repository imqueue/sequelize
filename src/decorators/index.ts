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
import 'reflect-metadata';
import { addOptions, getOptions } from 'sequelize-typescript';
export type FunctionType = (...args: any[]) => any;

export enum IndexMethod {
    BTREE = 'BTREE',
    HASH = 'HASH',
    GIST = 'GIST',
    SPGIST = 'SPGIST',
    GIN = 'GIN',
    BRIN = 'BRIN',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface ColumnIndexOptions {
    name: string;
    method: IndexMethod;
    concurrently: boolean;
    nullsFirst: boolean;
    order: SortOrder;
    predicate: string;
    expression: string;
    include: string[];
    collation: string;
    opClass: string;
    tablespace: string;
    safe: boolean;
    unique: boolean;
}

export function Index(options: Partial<ColumnIndexOptions>): FunctionType;
export function Index(
    target: any,
    propertyName: string,
    propertyDescriptor?: PropertyDescriptor,
): void;
export function Index(...args: any[]): FunctionType | void {
    if (args.length >= 2) {
        const [target, propertyName, propertyDescriptor] = args;

        return annotate(target, propertyName, propertyDescriptor);
    }

    return (
        target: any,
        propertyName: string,
        propertyDescriptor?: PropertyDescriptor,
    ) => {
        annotate(target, propertyName, propertyDescriptor, args[0]);
    };
}

function annotate(
    target: any,
    propertyName: string,
    propertyDescriptor?: PropertyDescriptor,
    options: Partial<ColumnIndexOptions> = {},
): void {
    const indices = (getOptions(target) as any).indices || [];
    addOptions(target, {
        indices: [...indices, {
            column: propertyName,
            options,
        }],
    } as any);
}

export * from './DynamicView';
export * from './View';
export * from './NullableIndex';
export * from './AssociatedWith';
