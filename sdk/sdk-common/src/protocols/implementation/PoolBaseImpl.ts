import type { Address } from '~sdk-common/common/implementation/Address'
import type { Token } from '~sdk-common/common/implementation/Token'
import type { IPool } from '~sdk-common/protocols/interfaces/IPool'
import type { PoolType } from '../interfaces/PoolType'
import type { IProtocolId } from '~sdk-common/protocols/interfaces/IProtocolId'
import type { IPoolId } from '~sdk-common/protocols/interfaces/IPoolId'

export class PoolBaseImpl<T extends PoolType> implements IPool {
  public readonly poolId: IPoolId
  public readonly protocolId: IProtocolId
  public readonly type: T
  public readonly address?: Address
  public readonly TVL?: number
  public readonly debtToken: Token
  public readonly collateralToken: Token

  constructor(params: {
    poolId: IPoolId
    protocolId: IProtocolId
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
