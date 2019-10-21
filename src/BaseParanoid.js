"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const rpc_1 = require("@imqueue/rpc");
const sequelize_typescript_1 = require("sequelize-typescript");
const BaseModel_1 = require("./BaseModel");
const decorators_1 = require("./decorators");
class BaseParanoid extends BaseModel_1.BaseModel {
    constructor(values, options) { super(values, options); }
}
__decorate([
    rpc_1.property('number'),
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Object)
], BaseParanoid.prototype, "id", void 0);
__decorate([
    rpc_1.property('Date'),
    decorators_1.Index,
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], BaseParanoid.prototype, "createdAt", void 0);
__decorate([
    rpc_1.property('Date'),
    decorators_1.Index,
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], BaseParanoid.prototype, "updatedAt", void 0);
__decorate([
    rpc_1.property('Date', true),
    decorators_1.NullableIndex,
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], BaseParanoid.prototype, "deletedAt", void 0);
exports.BaseParanoid = BaseParanoid;
//# sourceMappingURL=BaseParanoid.js.map