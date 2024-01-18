import { Token } from "~sdk/common";
import { PoolParameters } from "~sdk/protocols";

/**
 * @name StakingPoolParameters
 * @description Represents the parameters of a staking pool
 */
export type StakingPoolParameters = PoolParameters & {
    stakingToken: Token;
};
