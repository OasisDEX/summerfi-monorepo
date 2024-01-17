import { IToken } from "@sdk/common";
import { IPool, PoolType } from "./IPool";

/**
 * @interface ILendingPool
 * @description Represents a lending pool. Provides information about the collateral
 *              and debt tokens
 */
export interface ILendingPool extends IPool {
    collateralToken: IToken;
    debtToken: IToken;
}
