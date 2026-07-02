import { SerializationService } from '../../services/SerializationService'
import { PoolType } from '../enums/PoolType'
import { __signature__ } from '../interfaces/IArmadaVaultId'
import type { IAddress } from '../interfaces/IAddress'
import type { IArmadaProtocol } from '../interfaces/IArmadaProtocol'
import type { IArmadaVaultId, IArmadaVaultIdData } from '../interfaces/IArmadaVaultId'
import type { IChainInfo } from '../interfaces/IChainInfo'
import { ArmadaProtocol } from './ArmadaProtocol'
import { PoolId } from './PoolId'
import type { ChainId } from '../types/ChainId'
import type { AddressValue } from '../types/AddressValue'
import { Address } from './Address'
import { getChainInfoByChainId } from './ChainFamilies'

/**
 * Type for the parameters of ArmadaVaultId
 */
export type ArmadaVaultIdParameters = Omit<IArmadaVaultIdData, 'type' | 'protocol'>

/**
 * @see IArmadaVaultId
 */
export class ArmadaVaultId extends PoolId implements IArmadaVaultId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly chainInfo: IChainInfo
  readonly fleetAddress: IAddress
  readonly protocol: IArmadaProtocol

  /** FACTORY */
  static createFrom(params: ArmadaVaultIdParameters): ArmadaVaultId {
    return new ArmadaVaultId(params)
  }

  static createFromEthereum(params: {
    chainId: ChainId
    fleetAddressValue: AddressValue
  }): ArmadaVaultId {
    return new ArmadaVaultId({
      chainInfo: getChainInfoByChainId(params.chainId),
      fleetAddress: Address.createFromEthereum({ value: params.fleetAddressValue }),
    })
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaVaultIdParameters) {
    super(params)

    this.chainInfo = params.chainInfo
    this.fleetAddress = params.fleetAddress
    this.protocol = ArmadaProtocol.createFrom({ chainInfo: params.chainInfo })
  }
}

SerializationService.registerClass(ArmadaVaultId, { identifier: 'ArmadaVaultId' })
