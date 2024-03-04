import { Token } from '~sdk-common/common/implementation/Token'
import { PoolBaseImpl } from './PoolBaseImpl'
import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import type { Address } from '~sdk-common/common/implementation/Address'
import type { LendingPool } from '~sdk-common/protocols/interfaces/LendingPool'
import type { IPoolId } from '~sdk-common/protocols/interfaces/IPoolId'
import { PoolType } from '~sdk-common/protocols/interfaces/PoolType'
import { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

export class LendingPoolImpl extends PoolBaseImpl<PoolType.Lending> implements LendingPool {
  public readonly collateralTokens: Token[]
  public readonly debtTokens: Token[]
  public readonly maxLTV: Percentage

  constructor(params: {
    poolId: IPoolId
    protocol: ProtocolName
    address?: Address
    TVL?: number
    maxLTV: Percentage
    debtTokens: Token[]
    collateralTokens: Token[]
  }) {
    // TODO: resolve multicollateral issue
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.collateralTokens = params.collateralTokens
    this.debtTokens = params.debtTokens
    this.maxLTV = params.maxLTV
  }
}
