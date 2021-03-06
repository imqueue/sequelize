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
import { ColumnIndexOptions, FunctionType, ColumnIndex } from './ColumnIndex';

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type NullableColumnIndexOptions = Omit<ColumnIndexOptions, 'expression'>;

// noinspection JSUnusedGlobalSymbols
export function NullableIndex(
    options: Partial<NullableColumnIndexOptions>,
): FunctionType;
// noinspection JSUnusedGlobalSymbols
export function NullableIndex(
    target: any,
    propertyName: string,
    propertyDescriptor?: PropertyDescriptor,
): void;
// noinspection JSUnusedGlobalSymbols
export function NullableIndex(...args: any[]): FunctionType | void {
    if (args.length >= 2) {
        const [target, propertyName, propertyDescriptor] = args;
        const nullPredicate = `"${propertyName}" IS NULL`;
        const notNullPredicate = `"${propertyName}" IS NOT NULL`;

        ColumnIndex({
            expression: nullPredicate,
            predicate: nullPredicate,
        })(target, propertyName, propertyDescriptor);
        ColumnIndex({
            expression: notNullPredicate,
            predicate: notNullPredicate,
        })(target, propertyName, propertyDescriptor);

        return;
    }

    return (
        target: any,
        propertyName: string,
        propertyDescriptor?: PropertyDescriptor,
    ) => {
        ColumnIndex(Object.assign(args[0], {
            expression: `"${propertyName}" IS NULL`
        }))(target, propertyName, propertyDescriptor);
        ColumnIndex(Object.assign(args[0], {
            expression: `"${propertyName}" IS NOT NULL`
        }))(target, propertyName, propertyDescriptor);
    };
}
