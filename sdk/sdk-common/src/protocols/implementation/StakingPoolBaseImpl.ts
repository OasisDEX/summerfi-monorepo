import { Address, Token } from '~sdk-common/common'
import { PoolId, ProtocolId, PoolType, StakingPool } from '~sdk-common/protocols'
import { PoolBaseImpl } from './PoolBaseImpl'

export class StakingPoolImpl extends PoolBaseImpl implements StakingPool {
  public readonly stakingToken: Token

  constructor(params: {
    poolId: PoolId
    protocolId: ProtocolId
    address?: Address
    TVL?: number
    stakingToken: Token
  }) {
    super({ ...params, type: PoolType.Staking })

    this.stakingToken = params.stakingToken
  }
}
