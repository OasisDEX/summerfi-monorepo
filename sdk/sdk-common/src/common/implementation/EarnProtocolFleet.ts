import { IAddress } from '../interfaces/IAddress'
import { IChainInfo } from '../interfaces/IChainInfo'
import { IEarnProtocolFleet, IEarnProtocolFleetParameters } from '../interfaces/IEarnProtocolFleet'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name EarnProtocolFleet
 * @see IEarnProtocolFleet
 */
export class EarnProtocolFleet implements IEarnProtocolFleet {
  readonly _signature_0 = 'IEarnProtocolFleet'
  public readonly address: IAddress
  public readonly chainInfo: IChainInfo

  /** Factory method */
  static createFrom(params: IEarnProtocolFleetParameters): EarnProtocolFleet {
    return new EarnProtocolFleet(params)
  }

  /** Sealed constructor */
  protected constructor(params: IEarnProtocolFleetParameters) {
    this.address = Address.createFrom(params.address)
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }
}
