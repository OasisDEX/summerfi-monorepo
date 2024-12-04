import {
  IArmadaVaultId,
  IArmadaVaultIdData,
  IArmadaProtocol,
  __iarmadavaultid__,
} from '@summerfi/armada-protocol-common'
import { IAddress, PoolId } from '@summerfi/sdk-common'
import { IChainInfo, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ArmadaProtocol } from './ArmadaProtocol'

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
