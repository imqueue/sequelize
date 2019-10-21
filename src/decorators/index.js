"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
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
require("reflect-metadata");
const sequelize_typescript_1 = require("sequelize-typescript");
var IndexMethod;
(function (IndexMethod) {
    IndexMethod["BTREE"] = "BTREE";
    IndexMethod["HASH"] = "HASH";
    IndexMethod["GIST"] = "GIST";
    IndexMethod["SPGIST"] = "SPGIST";
    IndexMethod["GIN"] = "GIN";
    IndexMethod["BRIN"] = "BRIN";
})(IndexMethod = exports.IndexMethod || (exports.IndexMethod = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
function Index(...args) {
    if (args.length >= 2) {
        const [target, propertyName, propertyDescriptor] = args;
        return annotate(target, propertyName, propertyDescriptor);
    }
    return (target, propertyName, propertyDescriptor) => {
        annotate(target, propertyName, propertyDescriptor, args[0]);
    };
}
exports.Index = Index;
function annotate(target, propertyName, propertyDescriptor, options = {}) {
    const indices = sequelize_typescript_1.getOptions(target).indices || [];
    sequelize_typescript_1.addOptions(target, {
        indices: [...indices, {
                column: propertyName,
                options,
            }],
    });
}
__export(require("./View"));
__export(require("./NullableIndex"));
//# sourceMappingURL=index.js.map