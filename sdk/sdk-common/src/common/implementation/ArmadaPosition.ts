import { SerializationService } from '../../services/SerializationService'
import { PositionType } from '../enums/PositionType'
import { __signature__ } from '../interfaces/IArmadaPosition'
import type { IArmadaPosition, IArmadaPositionData } from '../interfaces/IArmadaPosition'
import type { IArmadaPositionId } from '../interfaces/IArmadaPositionId'
import type { IArmadaVault } from '../interfaces/IArmadaVault'
import type { ITokenAmount } from '../interfaces/ITokenAmount'
import { Position } from './Position'

/**
 * Type for the parameters of ArmadaPosition
 */
export type ArmadaPositionParameters = Omit<IArmadaPositionData, 'type'>

/**
 * @class ArmadaPosition
 * @see IArmadaPosition
 */
export class ArmadaPosition extends Position implements IArmadaPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type = PositionType.Armada
  readonly id: IArmadaPositionId
  readonly pool: IArmadaVault
  readonly amount: ITokenAmount
  readonly shares: ITokenAmount
  readonly deposits: ITokenAmount[]
  readonly withdrawals: ITokenAmount[]

  readonly claimedSummerToken: ITokenAmount
  readonly claimableSummerToken: ITokenAmount
  readonly rewards: Array<{
    claimed: ITokenAmount
    claimable: ITokenAmount
  }>

  /** FACTORY */
  static createFrom(params: ArmadaPositionParameters): ArmadaPosition {
    return new ArmadaPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ArmadaPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
    this.amount = params.amount
    this.shares = params.shares
    this.deposits = params.deposits
    this.withdrawals = params.withdrawals
    this.claimedSummerToken = params.claimedSummerToken
    this.claimableSummerToken = params.claimableSummerToken
    this.rewards = params.rewards
  }
}

SerializationService.registerClass(ArmadaPosition, { identifier: 'ArmadaPosition' })
