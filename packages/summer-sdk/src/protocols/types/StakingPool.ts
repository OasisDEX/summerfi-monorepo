import { IAddress, Token } from "@sdk/common";
import { IPoolId, IProtocolId, PoolType, IStakingPool } from "@sdk/protocols";
import { Pool } from "./Pool";

/**
 * @class StakingPool
 * @see IStakingPool
 */
export class StakingPool extends Pool implements IStakingPool {
    /// Instance Attributes
    public readonly stakingToken: Token;

    /// Constructor
    constructor(params: {
        poolId: IPoolId;
        protocolid: IProtocolId;
        address?: IAddress;
        TVL?: number;
        stakingToken: Token;
    }) {
        super({ ...params, type: PoolType.Staking });

        this.stakingToken = params.stakingToken;
    }
}
