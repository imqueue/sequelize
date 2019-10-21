"use strict";

exports.__esModule = true;

var _Db2Formatter = require("./languages/Db2Formatter");

var _Db2Formatter2 = _interopRequireDefault(_Db2Formatter);

var _N1qlFormatter = require("./languages/N1qlFormatter");

var _N1qlFormatter2 = _interopRequireDefault(_N1qlFormatter);

var _PlSqlFormatter = require("./languages/PlSqlFormatter");

var _PlSqlFormatter2 = _interopRequireDefault(_PlSqlFormatter);

var _StandardSqlFormatter = require("./languages/StandardSqlFormatter");

var _StandardSqlFormatter2 = _interopRequireDefault(_StandardSqlFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = {
    /**
     * Format whitespaces in a query to make it easier to read.
     *
     * @param {String} query
     * @param {Object} cfg
     *  @param {String} cfg.language Query language, default is Standard SQL
     *  @param {String} cfg.indent Characters used for indentation, default is "  " (2 spaces)
     *  @param {Object} cfg.params Collection of params for placeholder replacement
     * @return {String}
     */
    format: function format(query, cfg) {
        cfg = cfg || {};

        switch (cfg.language) {
            case "db2":
                return new _Db2Formatter2["default"](cfg).format(query);
            case "n1ql":
                return new _N1qlFormatter2["default"](cfg).format(query);
            case "pl/sql":
                return new _PlSqlFormatter2["default"](cfg).format(query);
            case "sql":
            case undefined:
                return new _StandardSqlFormatter2["default"](cfg).format(query);
            default:
                throw Error("Unsupported SQL dialect: " + cfg.language);
        }
    }
};
module.exports = exports["default"];