import { IAddress } from '../interfaces/IAddress'
import { IChainInfo } from '../interfaces/IChainInfo'
import { IEarnProtocolFleet, IEarnProtocolFleetData } from '../interfaces/IEarnProtocolFleet'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name EarnProtocolFleet
 * @see IEarnProtocolFleet
 */
export class EarnProtocolFleet implements IEarnProtocolFleet {
  public readonly address: IAddress
  public readonly chainInfo: IChainInfo

  /** Factory method */
  static createFrom(params: IEarnProtocolFleetData): EarnProtocolFleet {
    return new EarnProtocolFleet(params)
  }

  /** Sealed constructor */
  protected constructor(params: IEarnProtocolFleetData) {
    this.address = Address.createFrom(params.address)
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }
}
