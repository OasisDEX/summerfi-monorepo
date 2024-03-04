import { Address, Token } from '~sdk-common/common/implementation'
import { Pool, PoolId, ProtocolId, PoolType } from '~sdk-common/protocols'

export class PoolBaseImpl<T extends PoolType> implements Pool {
  public readonly poolId: PoolId
  public readonly protocolId: ProtocolId
  public readonly type: T
  public readonly address?: Address
  public readonly TVL?: number
  public readonly debtToken: Token
  public readonly collateralToken: Token

  constructor(params: {
    poolId: PoolId
    protocolId: ProtocolId
    type: T
    debtToken: Token
    collateralToken: Token
    address?: Address
    TVL?: number
  }) {
    this.poolId = params.poolId
    this.protocolId = params.protocolId
    this.type = params.type
    this.address = params.address
    this.TVL = params.TVL
    this.debtToken = params.debtToken
    this.collateralToken = params.collateralToken
  }
}
