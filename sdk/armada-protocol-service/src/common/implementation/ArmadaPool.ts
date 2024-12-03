import {
  IArmadaVault,
  IArmadaVaultData,
  IArmadaVaultId,
  __iarmadavault__,
} from '@summerfi/armada-protocol-common'
import { Pool, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPool
 */
export type ArmadaPoolParameters = Omit<IArmadaVaultData, 'type'>

/**
 * @class ArmadaPool
 * @see IArmadaVault
 */
export class ArmadaPool extends Pool implements IArmadaVault {
  /** SIGNATURE */
  readonly [__iarmadavault__] = __iarmadavault__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly id: IArmadaVaultId

  /** FACTORY */
  static createFrom(params: ArmadaPoolParameters): ArmadaPool {
    return new ArmadaPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(ArmadaPool, { identifier: 'ArmadaPool' })
