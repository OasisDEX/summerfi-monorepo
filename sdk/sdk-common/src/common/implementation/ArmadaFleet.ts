import { IAddress } from '../interfaces/IAddress'
import { IArmadaFleet, IArmadaFleetData, __signature__ } from '../interfaces/IArmadaFleet'
import { IChainInfo } from '../interfaces/IChainInfo'
import { Address } from './Address'
import { ChainInfo } from './ChainInfo'

/**
 * Type for the parameters of ArmadaFleet
 */
export type ArmadaFleetParameters = Omit<IArmadaFleetData, ''>

/**
 * @name ArmadaFleet
 * @see IArmadaFleet
 */
export class ArmadaFleet implements IArmadaFleet {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly address: IAddress
  readonly chainInfo: IChainInfo

  /** FACTORY METHODS */
  static createFrom(params: ArmadaFleetParameters): ArmadaFleet {
    return new ArmadaFleet(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ArmadaFleetParameters) {
    this.address = Address.createFrom(params.address)
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
  }
}
