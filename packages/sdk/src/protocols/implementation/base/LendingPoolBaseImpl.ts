import { Address, Percentage, Token } from '~sdk/common'
import { PoolId, ProtocolId, PoolType, LendingPool } from '~sdk/protocols'
import { PoolBaseImpl } from './PoolBaseImpl'

export class LendingPoolImpl extends PoolBaseImpl implements LendingPool {
  public readonly collateralTokens: Token[]
  public readonly debtTokens: Token[]
  public readonly maxLTV: Percentage

  /// Constructor
  constructor(params: {
    poolId: PoolId
    protocolId: ProtocolId
    address?: Address
    TVL?: number
    maxLTV: Percentage
    debtTokens: Token[]
    collateralTokens: Token[]
  }) {
    super({ ...params, type: PoolType.Lending })

    this.collateralTokens = params.collateralTokens
    this.debtTokens = params.debtTokens
    this.maxLTV = params.maxLTV
  }
}
