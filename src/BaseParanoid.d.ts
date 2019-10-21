import { ModelAttributes } from 'sequelize';
import { BaseModel, BuildOptions } from './BaseModel';
export declare abstract class BaseParanoid<T> extends BaseModel<T> {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    protected constructor(values?: ModelAttributes, options?: BuildOptions);
}
