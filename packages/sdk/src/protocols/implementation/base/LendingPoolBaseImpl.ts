import { Address, Token } from '~sdk/common'
import { PoolId, ProtocolId, PoolType, LendingPool } from '~sdk/protocols'
import { PoolBaseImpl } from './PoolBaseImpl'
/**
 * @class LendingPool
 * @see ILendingPool
 */
export class LendingPoolImpl extends PoolBaseImpl implements LendingPool {
  /// Instance Attributes
  public readonly debtToken: Token
  public readonly collateralToken: Token

  /// Constructor
  constructor(params: {
    poolId: PoolId
    protocolid: ProtocolId
    address?: Address
    TVL?: number
    debtToken: Token
    collateralToken: Token
  }) {
    super({ ...params, type: PoolType.Lending })

    this.debtToken = params.debtToken
    this.collateralToken = params.collateralToken
  }
}
