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
import { ModelAttributes } from 'sequelize';
import {
    AllowNull,
    Column,
    DataType,
} from 'sequelize-typescript';
import { BuildOptions } from './BaseModel';
import { BaseParanoid } from './BaseParanoid';

// noinspection JSUnusedGlobalSymbols
export abstract class BaseDictionary<T> extends BaseParanoid<T> {
    @property('string')
    @AllowNull(false)
    @Column(DataType.STRING(45))
    public name: string;

    @property('string', true)
    @AllowNull(true)
    @Column(DataType.TEXT)
    public description: string;

    protected constructor(
        values?: ModelAttributes,
        options?: BuildOptions,
    ) { super(values, options); }
}
