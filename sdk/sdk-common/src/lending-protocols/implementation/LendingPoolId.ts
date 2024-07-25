import { PoolId } from '../../common/implementation/PoolId'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { SerializationService } from '../../services'
import { ILendingPoolId, ILendingPoolIdData } from '../interfaces/ILendingPoolId'

/**
 * LendingPoolId
 * @see ILendingPoolId
 */
export abstract class LendingPoolId extends PoolId implements ILendingPoolId, IPrintable {
  protected constructor(params: ILendingPoolIdData) {
    super(params)
  }

  toString(): string {
    return `Lending Pool ID: ${this.protocol.toString()}`
  }
}

SerializationService.registerClass(LendingPoolId)
