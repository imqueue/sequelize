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


export interface IAssociated {
    model: any;
    input: any;
    modelFieldName?: string;
}

/**
 * Defines property for build association between filter
 * fields and specific model
 *
 * @param {IAssociated} association - input data
 */
export function AssociatedWith(
    association?: IAssociated,
) {

    return (target: any, key: string) => {
        if (!association) { return target; }

        if (!association.modelFieldName) {
            association.modelFieldName = key;
        }
        Object.defineProperty(target, key, {
            value: {
                model: association.model,
                input: association.input,
                key: association.modelFieldName,
            },
        });

        return target;
    };
}
