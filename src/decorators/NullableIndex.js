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
const index_1 = require("./index");
function NullableIndex(...args) {
    if (args.length >= 2) {
        const [target, propertyName, propertyDescriptor] = args;
        const nullPredicate = `"${propertyName}" IS NULL`;
        const notNullPredicate = `"${propertyName}" IS NOT NULL`;
        index_1.Index({ expression: nullPredicate, predicate: nullPredicate })(target, propertyName, propertyDescriptor);
        index_1.Index({ expression: notNullPredicate, predicate: notNullPredicate })(target, propertyName, propertyDescriptor);
        return;
    }
    return (target, propertyName, propertyDescriptor) => {
        index_1.Index(Object.assign(args[0], {
            expression: `"${propertyName}" IS NULL`
        }))(target, propertyName, propertyDescriptor);
        index_1.Index(Object.assign(args[0], {
            expression: `"${propertyName}" IS NOT NULL`
        }))(target, propertyName, propertyDescriptor);
    };
}
exports.NullableIndex = NullableIndex;
//# sourceMappingURL=NullableIndex.js.map