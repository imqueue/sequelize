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
import { property } from '@imqueue/rpc';
import { Op } from 'sequelize';

export const FILTER_OPS = {
    $and: Op.and,
    $or: Op.or,
    $gt: Op.gt,
    $gte: Op.gte,
    $lt: Op.lt,
    $lte: Op.lte,
    $ne: Op.ne,
    $eq: Op.eq,
    $not: Op.not,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $in: Op.in,
    $notIn: Op.notIn,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $any: Op.any,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
};

export class FilterInput {
    @property(
        'FilterInput | Array<FilterInput|number|string|boolean|null>',
        true)
    public $and?:
        FilterInput | Array<FilterInput|number|string|boolean|null>;

    @property(
        'FilterInput | Array<FilterInput|number|string|boolean|null>',
        true)
    public $or?:
        FilterInput | Array<FilterInput|number|string|boolean|null>;

    @property('number', true)
    public $gt?: number;

    @property('number', true)
    public $gte?: number;

    @property('number', true)
    public $lt?: number;

    @property('number', true)
    public $lte?: number;

    @property('number | string', true)
    public $ne?: number | string;

    @property('number | string | boolean | null', true)
    public $eq?: number | string | boolean | null;

    @property('boolean', true)
    public $not?: boolean;

    @property('Array<number | string>', true)
    public $between?: Array<number | string>;

    @property('Array<number | string>', true)
    public $notBetween?: Array<number | string>;

    @property('Array<number | string | boolean | null>', true)
    public $in?: Array<number | string | boolean | null>;

    @property('Array<number | string | boolean | null>', true)
    public $notIn?: Array<number | string | boolean | null>;

    @property('string', true)
    public $like?: string;

    @property('string', true)
    public $notLike?: string;

    @property('string', true)
    public $iLike?: string;

    @property('string', true)
    public $notILike?: string;

    @property('string', true)
    public $regexp?: string;

    @property('string', true)
    public $notRegexp?: string;

    @property('string', true)
    public $iRegexp?: string;

    @property('string', true)
    public $notIRegexp?: string;

    @property('[number, number]', true)
    public $overlap?: [number, number];

    @property('number | [number, number]', true)
    public $contains?: number | [number, number];

    @property('[number, number]', true)
    public $contained?: [number, number];

    @property('number[] | string[]', true)
    public $any?: number[] | string[];

    @property('[number, number]', true)
    public $adjacent?: [number, number];

    @property('[number, number]', true)
    public $strictLeft?: [number, number];

    @property('[number, number]', true)
    public $strictRight?: [number, number];

    @property('[number, number]', true)
    public $noExtendRight?: [number, number];

    @property('[number, number]', true)
    public $noExtendLeft?: [number, number];
}
