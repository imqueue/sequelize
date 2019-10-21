import { ModelAttributes } from 'sequelize';
import { BuildOptions } from './BaseModel';
import { BaseParanoid } from './BaseParanoid';
export declare abstract class BaseDictionary<T> extends BaseParanoid<T> {
    name: string;
    description: string;
    protected constructor(values?: ModelAttributes, options?: BuildOptions);
}
