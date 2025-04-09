import { SerializationService } from '../../services/SerializationService'
import { PoolType } from '../enums/PoolType'
import { __iarmadavaultid__ } from '../interfaces'
import type { IAddress } from '../interfaces/IAddress'
import type { IArmadaProtocol } from '../interfaces/IArmadaProtocol'
import type { IArmadaVaultId, IArmadaVaultIdData } from '../interfaces/IArmadaVaultId'
import type { IChainInfo } from '../interfaces/IChainInfo'
import { ArmadaProtocol } from './ArmadaProtocol'
import { PoolId } from './PoolId'

/**
 * Type for the parameters of ArmadaVaultId
 */
export type ArmadaVaultIdParameters = Omit<IArmadaVaultIdData, 'type' | 'protocol'>

/**
 * @class ArmadaVaultId
 * @see IArmadaVaultId
 */
export class ArmadaVaultId extends PoolId implements IArmadaVaultId {
  /** SIGNATURE */
  readonly [__iarmadavaultid__] = __iarmadavaultid__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly chainInfo: IChainInfo
  readonly fleetAddress: IAddress
  readonly protocol: IArmadaProtocol

  /** FACTORY */
  static createFrom(params: ArmadaVaultIdParameters): ArmadaVaultId {
    return new ArmadaVaultId(params)
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
