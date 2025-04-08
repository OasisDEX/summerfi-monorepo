import { SerializationService } from '../../services/SerializationService'
import { PoolType } from '../enums/PoolType'
import { __iarmadavault__ } from '../interfaces'
import type { IArmadaVault, IArmadaVaultData } from '../interfaces/IArmadaVault'
import { type IArmadaVaultId } from '../interfaces/IArmadaVaultId'
import { Pool } from './Pool'

/**
 * Type for the parameters of ArmadaVault
 */
export type ArmadaVaultParameters = Omit<IArmadaVaultData, 'type'>

/**
 * @class ArmadaVault
 * @see IArmadaVault
 */
export class ArmadaVault extends Pool implements IArmadaVault {
  /** SIGNATURE */
  readonly [__iarmadavault__] = __iarmadavault__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly id: IArmadaVaultId

  /** FACTORY */
  static createFrom(params: ArmadaVaultParameters): ArmadaVault {
    return new ArmadaVault(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaVaultParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(ArmadaVault, { identifier: 'ArmadaVault' })
