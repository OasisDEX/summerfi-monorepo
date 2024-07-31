import { Address } from '../../../common/implementation/Address'
import { IAddress } from '../../../common/interfaces/IAddress'
import { IPrintable } from '../../../common/interfaces/IPrintable'
import { IPositionsManager, IPositionsManagerData } from '../interfaces/IPositionsManager'

/**
 * @class PositionsManager
 * @see IPositionsManager
 */
export class PositionsManager implements IPositionsManager, IPrintable {
  public address: IAddress

  /** Factory method */
  public static createFrom(params: IPositionsManagerData): PositionsManager {
    return new PositionsManager(params)
  }

  /** Sealed constructor */
  private constructor(params: IPositionsManagerData) {
    this.address = Address.createFromEthereum(params.address)
  }

  toString(): string {
    return `PositionsManager: ${this.address.toString()})`
  }
}
