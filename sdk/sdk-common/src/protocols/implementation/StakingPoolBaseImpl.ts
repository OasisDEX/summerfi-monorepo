import { Address, Token } from '~sdk-common/common/implementation'
import { PoolId, PoolType, ProtocolName, StakingPool } from '~sdk-common/protocols'
import { PoolBaseImpl } from './PoolBaseImpl'

export class StakingPoolImpl extends PoolBaseImpl implements StakingPool {
  public readonly stakingToken: Token

  constructor(params: {
    poolId: PoolId
    protocol: ProtocolName
    address?: Address
    TVL?: number
    stakingToken: Token
  }) {
    super({ ...params, type: PoolType.Staking })

    this.stakingToken = params.stakingToken
  }
}
