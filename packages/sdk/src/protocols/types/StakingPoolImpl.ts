import { Address, Token } from "~sdk/common";
import { PoolId, ProtocolId, PoolType, StakingPool } from "~sdk/protocols";
import { PoolImpl } from "./PoolImpl";

/**
 * @class StakingPool
 * @see IStakingPool
 */
export class StakingPoolImpl extends PoolImpl implements StakingPool {
    /// Instance Attributes
    public readonly stakingToken: Token;

    /// Constructor
    constructor(params: {
        poolId: PoolId;
        protocolid: ProtocolId;
        address?: Address;
        TVL?: number;
        stakingToken: Token;
    }) {
        super({ ...params, type: PoolType.Staking });

        this.stakingToken = params.stakingToken;
    }
}
