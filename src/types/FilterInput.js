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
const sequelize_1 = require("sequelize");
exports.FILTER_OPS = {
    $and: sequelize_1.Op.and,
    $or: sequelize_1.Op.or,
    $gt: sequelize_1.Op.gt,
    $gte: sequelize_1.Op.gte,
    $lt: sequelize_1.Op.lt,
    $lte: sequelize_1.Op.lte,
    $ne: sequelize_1.Op.ne,
    $eq: sequelize_1.Op.eq,
    $not: sequelize_1.Op.not,
    $between: sequelize_1.Op.between,
    $notBetween: sequelize_1.Op.notBetween,
    $in: sequelize_1.Op.in,
    $notIn: sequelize_1.Op.notIn,
    $like: sequelize_1.Op.like,
    $notLike: sequelize_1.Op.notLike,
    $iLike: sequelize_1.Op.iLike,
    $notILike: sequelize_1.Op.notILike,
    $regexp: sequelize_1.Op.regexp,
    $notRegexp: sequelize_1.Op.notRegexp,
    $iRegexp: sequelize_1.Op.iRegexp,
    $notIRegexp: sequelize_1.Op.notIRegexp,
    $overlap: sequelize_1.Op.overlap,
    $contains: sequelize_1.Op.contains,
    $contained: sequelize_1.Op.contained,
    $any: sequelize_1.Op.any,
    $adjacent: sequelize_1.Op.adjacent,
    $strictLeft: sequelize_1.Op.strictLeft,
    $strictRight: sequelize_1.Op.strictRight,
    $noExtendRight: sequelize_1.Op.noExtendRight,
    $noExtendLeft: sequelize_1.Op.noExtendLeft,
};
class FilterInput {
}
__decorate([
    rpc_1.property('FilterInput | Array<FilterInput|number|string|boolean|null>', true),
    __metadata("design:type", Object)
], FilterInput.prototype, "$and", void 0);
__decorate([
    rpc_1.property('FilterInput | Array<FilterInput|number|string|boolean|null>', true),
    __metadata("design:type", Object)
], FilterInput.prototype, "$or", void 0);
__decorate([
    rpc_1.property('number', true),
    __metadata("design:type", Number)
], FilterInput.prototype, "$gt", void 0);
__decorate([
    rpc_1.property('number', true),
    __metadata("design:type", Number)
], FilterInput.prototype, "$gte", void 0);
__decorate([
    rpc_1.property('number', true),
    __metadata("design:type", Number)
], FilterInput.prototype, "$lt", void 0);
__decorate([
    rpc_1.property('number', true),
    __metadata("design:type", Number)
], FilterInput.prototype, "$lte", void 0);
__decorate([
    rpc_1.property('number | string', true),
    __metadata("design:type", Object)
], FilterInput.prototype, "$ne", void 0);
__decorate([
    rpc_1.property('number | string | boolean | null', true),
    __metadata("design:type", Object)
], FilterInput.prototype, "$eq", void 0);
__decorate([
    rpc_1.property('boolean', true),
    __metadata("design:type", Boolean)
], FilterInput.prototype, "$not", void 0);
__decorate([
    rpc_1.property('Array<number | string>', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$between", void 0);
__decorate([
    rpc_1.property('Array<number | string>', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$notBetween", void 0);
__decorate([
    rpc_1.property('Array<number | string | boolean | null>', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$in", void 0);
__decorate([
    rpc_1.property('Array<number | string | boolean | null>', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$notIn", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$like", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$notLike", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$iLike", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$notILike", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$regexp", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$notRegexp", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$iRegexp", void 0);
__decorate([
    rpc_1.property('string', true),
    __metadata("design:type", String)
], FilterInput.prototype, "$notIRegexp", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$overlap", void 0);
__decorate([
    rpc_1.property('number | [number, number]', true),
    __metadata("design:type", Object)
], FilterInput.prototype, "$contains", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$contained", void 0);
__decorate([
    rpc_1.property('number[] | string[]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$any", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$adjacent", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$strictLeft", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$strictRight", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$noExtendRight", void 0);
__decorate([
    rpc_1.property('[number, number]', true),
    __metadata("design:type", Array)
], FilterInput.prototype, "$noExtendLeft", void 0);
exports.FilterInput = FilterInput;
//# sourceMappingURL=FilterInput.js.map