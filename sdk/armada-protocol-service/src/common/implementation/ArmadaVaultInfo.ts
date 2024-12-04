import {
  IArmadaVaultId,
  IArmadaVaultInfo,
  IArmadaVaultInfoData,
  __iarmadavaultinfo__,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount, PoolInfo, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters
 */
export type ArmadaVaultInfoParameters = Omit<IArmadaVaultInfoData, 'type'>

/**
 * @class ArmadaVaultInfo
 * @see IArmadaVaultInfo
 */
export class ArmadaVaultInfo extends PoolInfo implements IArmadaVaultInfo {
  /** SIGNATURE */
  readonly [__iarmadavaultinfo__] = __iarmadavaultinfo__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly id: IArmadaVaultId
  readonly depositCap: ITokenAmount
  readonly totalDeposits: ITokenAmount
  readonly totalShares: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaVaultInfoParameters): ArmadaVaultInfo {
    return new ArmadaVaultInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaVaultInfoParameters) {
    super(params)

    this.id = params.id
    this.depositCap = params.depositCap
    this.totalDeposits = params.totalDeposits
    this.totalShares = params.totalShares
  }
}

SerializationService.registerClass(ArmadaVaultInfo, { identifier: 'ArmadaPoolInfo' })
