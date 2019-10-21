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
require("reflect-metadata");
const sequelize_typescript_1 = require("sequelize-typescript");
// noinspection JSUnusedGlobalSymbols
/**
 * Decorator factory: @View
 *
 * Adding view support for sequelize models, making sure views
 * could be defined in a safe way without a problems with sync/drop ops,
 * etc.
 * This decorator simply annotate a model entity the same way @Table does,
 * adding extra option "treatAsView" which is utilized by a BaseModel
 * class to override native behavior of sequelize models.
 *
 * @param {IViewDefineOptions | string} options - view definition options
 * @return {(...args: any[] => any)} - view annotation decorator
 */
function View(options) {
    if (typeof options === 'string') {
        options = { viewDefinition: options };
    }
    else if (!options || !options.viewDefinition.trim()) {
        throw new TypeError('View definition is missing!');
    }
    return (target) => annotate(target, options);
}
exports.View = View;
/**
 * Does the job to define the view table
 *
 * @param {any} target - model class
 * @param {IViewDefineOptions} options - view definition options
 */
function annotate(target, options) {
    Object.assign(options, { treatAsView: true });
    sequelize_typescript_1.setModelName(target.prototype, options.modelName || target.name);
    sequelize_typescript_1.addOptions(target.prototype, options);
}
//# sourceMappingURL=View.js.map