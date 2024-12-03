import {
  IArmadaVaultId,
  IArmadaVaultInfo,
  IArmadaVaultInfoData,
  __iarmadavaultinfo__,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount, PoolInfo, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPool
 */
export type ArmadaPoolInfoParameters = Omit<IArmadaVaultInfoData, 'type'>

/**
 * @class ArmadaPoolInfo
 * @see IArmadaVaultInfo
 */
export class ArmadaPoolInfo extends PoolInfo implements IArmadaVaultInfo {
  /** SIGNATURE */
  readonly [__iarmadavaultinfo__] = __iarmadavaultinfo__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly id: IArmadaVaultId
  readonly depositCap: ITokenAmount
  readonly totalDeposits: ITokenAmount
  readonly totalShares: ITokenAmount

  /** FACTORY */
  static createFrom(params: ArmadaPoolInfoParameters): ArmadaPoolInfo {
    return new ArmadaPoolInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaPoolInfoParameters) {
    super(params)

    this.id = params.id
    this.depositCap = params.depositCap
    this.totalDeposits = params.totalDeposits
    this.totalShares = params.totalShares
  }
}

SerializationService.registerClass(ArmadaPoolInfo, { identifier: 'ArmadaPoolInfo' })
