import { PoolBaseImpl } from './PoolBaseImpl'
import type { Token } from '~sdk-common/common/implementation/Token'
import type { Address } from '~sdk-common/common/implementation/Address'
import type { IPoolId } from '~sdk-common/protocols/interfaces/IPoolId'
import { PoolType } from '../interfaces/PoolType'
import type { StakingPool } from '~sdk-common/protocols/interfaces/StakingPool'
import type { IProtocolId } from '~sdk-common/protocols/interfaces/IProtocolId'

export class StakingPoolImpl extends PoolBaseImpl<PoolType.Staking> implements StakingPool {
  public readonly stakingToken: Token

  constructor(params: {
    poolId: IPoolId
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
