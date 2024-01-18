import { Address, Token } from '~sdk/common'
import { PoolId, ProtocolId, PoolType, StakingPool } from '~sdk/protocols'
import { PoolBaseImpl } from './PoolBaseImpl'

/**
 * @class StakingPool
 * @see IStakingPool
 */
export class StakingPoolImpl extends PoolBaseImpl implements StakingPool {
  /// Instance Attributes
  public readonly stakingToken: Token

  /// Constructor
  constructor(params: {
    poolId: PoolId
    protocolid: ProtocolId
    address?: Address
    TVL?: number
    stakingToken: Token
  }) {
    super({ ...params, type: PoolType.Staking })

    this.stakingToken = params.stakingToken
  }
}
