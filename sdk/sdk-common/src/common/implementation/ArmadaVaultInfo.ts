import { SerializationService } from '../../services/SerializationService'
import { PoolType } from '../enums/PoolType'
import type { IArmadaVaultId } from '../interfaces/IArmadaVaultId'
import type { IArmadaVaultInfo, IArmadaVaultInfoData } from '../interfaces/IArmadaVaultInfo'
import { __signature__ } from '../interfaces/IArmadaVaultInfo'
import type { IPercentage } from '../interfaces/IPercentage'
import type { IToken } from '../interfaces/IToken'
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
  readonly token: IToken
  readonly depositCap: ITokenAmount
  readonly totalDeposits: ITokenAmount
  readonly totalShares: ITokenAmount
  readonly apy: IPercentage | null
  readonly rewardsApys: Array<{
    token: IToken
    apy: IPercentage | null
  }>

  /** FACTORY */
  static createFrom(params: ArmadaVaultInfoParameters): ArmadaVaultInfo {
    return new ArmadaVaultInfo(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: ArmadaVaultInfoParameters) {
    super(params)

    this.id = params.id
    this.token = params.token
    this.depositCap = params.depositCap
    this.totalDeposits = params.totalDeposits
    this.totalShares = params.totalShares
    this.apy = params.apy
    this.rewardsApys = params.rewardsApys
  }
}

SerializationService.registerClass(ArmadaVaultInfo, { identifier: 'ArmadaVaultInfo' })
