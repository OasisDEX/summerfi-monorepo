import { IToken } from "@sdk/common";
import { IPool } from "./IPool";

/**
 * @interface IStakingPool
 * @description Represents a staking pool. Provides information about the staking token
 */
export interface IStakingPool extends IPool {
    stakingToken: IToken;
}
