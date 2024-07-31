import { IAddress } from '../interfaces/IAddress'
import { IArmadaFleet, IArmadaFleetParameters } from '../interfaces/IArmadaFleet'
import { IChainInfo } from '../interfaces/IChainInfo'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name ArmadaFleet
 * @see IArmadaFleet
 */
export class ArmadaFleet implements IArmadaFleet {
  readonly _signature_0 = 'IArmadaFleet'
  public readonly address: IAddress
  public readonly chainInfo: IChainInfo

  /** Factory method */
  static createFrom(params: IArmadaFleetParameters): ArmadaFleet {
    return new ArmadaFleet(params)
  }

  /** Sealed constructor */
  protected constructor(params: IArmadaFleetParameters) {
    this.address = Address.createFrom(params.address)
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }
}
