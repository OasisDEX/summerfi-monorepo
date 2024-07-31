import { IAddress } from '../interfaces/IAddress'
import { IArmadaFleet, IArmadaFleetParameters, __iarmadafleet__ } from '../interfaces/IArmadaFleet'
import { IChainInfo } from '../interfaces/IChainInfo'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * @name ArmadaFleet
 * @see IArmadaFleet
 */
export class ArmadaFleet implements IArmadaFleet {
  /** SIGNATURE */
  readonly [__iarmadafleet__] = 'IArmadaFleet'

  /** ATTRIBUTES */
  readonly address: IAddress
  readonly chainInfo: IChainInfo

  /** FACTORY METHODS */
  static createFrom(params: IArmadaFleetParameters): ArmadaFleet {
    return new ArmadaFleet(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IArmadaFleetParameters) {
    this.address = Address.createFrom(params.address)
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }
}
