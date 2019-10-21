"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
const db = src_1.database({
    modelsPath: './debug',
    connectionString: 'postgres://debug:debug@localhost/debug',
    logger: console,
    sequelize: {},
});
(async () => {
    await db.sync();
})();
// console.log(MyTable.options);
//# sourceMappingURL=debug.js.map