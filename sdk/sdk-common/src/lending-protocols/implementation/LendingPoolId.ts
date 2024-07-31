import { PoolType } from '../../common'
import { PoolId } from '../../common/implementation/PoolId'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { ILendingPoolId, ILendingPoolIdParameters } from '../interfaces/ILendingPoolId'

/**
 * LendingPoolId
 * @see ILendingPoolId
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolId, IPrintable {
  readonly _signature_1 = 'ILendingPoolId'

  protected constructor(params: ILendingPoolIdParameters) {
    super({
      ...params,
      type: PoolType.Lending,
    })
  }

  toString(): string {
    return `Lending Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(LendingPoolId)
