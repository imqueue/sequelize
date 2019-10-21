import { Table } from 'sequelize-typescript';
import { BaseParanoid } from '../src';

@Table({ freezeTableName: true })
export class MyTable extends BaseParanoid<MyTable> {
}
