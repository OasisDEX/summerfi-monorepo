import { Token } from "@sdk/common";
import { IPoolParameters } from "../interface/IPoolParameters";

/**
 * @name LendingPoolParameters
 * @description Represents the parameters of a lending pool
 */
export type LendingPoolParameters = IPoolParameters & {
    debtToken: Token;
    collateralToken: Token;
};

/**
 * @name StakingPoolParameters
 * @description Represents the parameters of a staking pool
 */
export type StakingPoolParameters = IPoolParameters & {
    stakingToken: Token;
};
