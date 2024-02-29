import { Address } from '../../common/implementation/Address'
import { Token } from '../../common/implementation/Token'
import { StakingPool } from '../interfaces/StakingPool'
import { PoolId, IProtocolId } from '../interfaces/IDs'

import { PoolBaseImpl } from './PoolBaseImpl'
import { PoolType } from '../interfaces/IPool'

export class StakingPoolImpl extends PoolBaseImpl<PoolType.Staking> implements StakingPool {
  public readonly stakingToken: Token

  constructor(params: {
    poolId: PoolId
    protocolId: IProtocolId
    address?: Address
    TVL?: number
    stakingToken: Token
  }) {
    // TODO: I DON"T KNOW WHAT TO DO WITH THIS, what is the collateral token for stakiing pool?
    super({
      ...params,
      type: PoolType.Staking,
      debtToken: params.stakingToken,
      collateralToken: params.stakingToken,
    })

    this.stakingToken = params.stakingToken
  }
}
