import {
  IArmadaPool,
  IArmadaPoolData,
  IArmadaVaultId,
  __iarmadapool__,
} from '@summerfi/armada-protocol-common'
import { Pool, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPool
 */
export type ArmadaPoolParameters = Omit<IArmadaPoolData, 'type'>

/**
 * @class ArmadaPool
 * @see IArmadaPool
 */
export class ArmadaPool extends Pool implements IArmadaPool {
  /** SIGNATURE */
  readonly [__iarmadapool__] = __iarmadapool__

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
