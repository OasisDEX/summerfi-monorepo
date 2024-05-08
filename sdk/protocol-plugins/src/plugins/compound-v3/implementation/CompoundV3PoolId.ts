import { PoolId } from '@summerfi/sdk-common/protocols'
import { ICompoundV3PoolId } from '../interfaces/ICompoundV3PoolId'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ICompoundV3Protocol } from '../interfaces/ICompoundV3Protocol'
import { TokenSymbol } from '@summerfi/sdk-common'
import { Address } from '@summerfi/sdk-common/common'

export class CompoundV3PoolId extends PoolId implements ICompoundV3PoolId {
  protocol: ICompoundV3Protocol
  debt: TokenSymbol
  collaterals: TokenSymbol[]
  comet: Address

  private constructor(params: ICompoundV3PoolId) {
    super(params)

    this.protocol = params.protocol
    this.debt = params.debt
    this.collaterals = params.collaterals
    this.comet = params.comet
  }

  static createFrom(params: ICompoundV3PoolId): CompoundV3PoolId {
    return new CompoundV3PoolId(params)
  }
}

SerializationService.registerClass(CompoundV3PoolId)
