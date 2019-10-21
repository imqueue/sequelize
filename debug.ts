import { MyTable } from './debug/MyTable';
import { database } from './src';

const db = database({
    modelsPath: './debug',
    connectionString: 'postgres://debug:debug@localhost/debug',
    logger: console,
    sequelize: {},
});

(async () => {
    await db.sync();
})();

// console.log(MyTable.options);
