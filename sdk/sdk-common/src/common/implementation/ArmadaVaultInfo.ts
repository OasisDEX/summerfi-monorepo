import { SerializationService } from '../../services/SerializationService'
import { PoolType } from '../enums/PoolType'
import { __signature__ } from '../interfaces/IArmadaVaultInfo'
import type { IArmadaVaultId } from '../interfaces/IArmadaVaultId'
import type { IArmadaVaultInfo, IArmadaVaultInfoData } from '../interfaces/IArmadaVaultInfo'
import type { ITokenAmount } from '../interfaces/ITokenAmount'
import { PoolInfo } from './PoolInfo'

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
  readonly [__signature__] = __signature__

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
