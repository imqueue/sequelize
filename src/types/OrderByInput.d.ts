/**
 * Allowed ordering directions
 */
export declare enum OrderDirection {
    asc = "ASC",
    desc = "DESC"
}
export declare const ENUM_ORDER_DIRECTION: string;
export declare class OrderByInput {
    [fieldName: string]: OrderDirection;
}
