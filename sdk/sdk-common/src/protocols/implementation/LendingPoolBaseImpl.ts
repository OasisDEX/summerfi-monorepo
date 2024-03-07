import { Address } from '../../common/implementation/Address'
import { Percentage } from '../../common/implementation/Percentage'
import { Token } from '../../common/implementation/Token'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { LendingPool } from '../interfaces/LendingPool'
import { PoolType } from '../interfaces/PoolType'
import { PoolBaseImpl } from './PoolBaseImpl'

export class LendingPoolImpl extends PoolBaseImpl<PoolType.Lending> implements LendingPool {
  public readonly collateralTokens: Token[]
  public readonly debtTokens: Token[]
  public readonly maxLTV: Percentage

  constructor(params: {
    poolId: IPoolId
    protocol: IProtocol
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
