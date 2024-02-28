import { Address, Token } from '~sdk-common/common/implementation'
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
  // TODO: I DON"T KNOW WHAT TO DO WITH THIS, what is the collateral token for stakiing pool?
    super({ ...params, type: PoolType.Staking, debtToken: params.stakingToken, collateralToken: params.stakingToken})

    this.stakingToken = params.stakingToken
  }
}
