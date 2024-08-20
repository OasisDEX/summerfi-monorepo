import {
  IArmadaPoolId,
  IArmadaPoolInfo,
  IArmadaPoolInfoData,
  __iarmadapoolinfo__,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount, PoolInfo, PoolType } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

/**
 * Type for the parameters of ArmadaPool
 */
export type ArmadaPoolInfoParameters = Omit<IArmadaPoolInfoData, 'type'>

/**
 * @class ArmadaPoolInfo
 * @see IArmadaPoolInfo
 */
export class ArmadaPoolInfo extends PoolInfo implements IArmadaPoolInfo {
  /** SIGNATURE */
  readonly [__iarmadapoolinfo__] = __iarmadapoolinfo__

  /** ATTRIBUTES */
  readonly type = PoolType.Armada
  readonly id: IArmadaPoolId
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

SerializationService.registerClass(ArmadaPoolInfo)
