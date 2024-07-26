import { IArmadaPool, IArmadaPoolId, IArmadaPoolParameters } from '@summerfi/armada-protocol-common'
import { Pool, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * @class ArmadaPool
 * @see IArmadaPool
 */
export class ArmadaPool extends Pool implements IArmadaPool {
  readonly _signature_1 = 'IArmadaPool'

  readonly id: IArmadaPoolId

  /** Factory method */
  static createFrom(params: IArmadaPoolParameters): ArmadaPool {
    return new ArmadaPool(params)
  }

  /** Sealed constructor */
  private constructor(params: IArmadaPoolParameters) {
    super({
      ...params,
      type: PoolType.Armada,
    })

    this.id = params.id
  }
}

SerializationService.registerClass(ArmadaPool)
