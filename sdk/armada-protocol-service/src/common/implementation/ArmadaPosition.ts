import {
  IArmadaVault,
  IArmadaPosition,
  IArmadaPositionData,
  IArmadaPositionId,
  __iarmadaposition__,
} from '@summerfi/armada-protocol-common'
import { PositionType } from '@summerfi/sdk-common'
import { ITokenAmount, Position } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

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
  readonly [__iarmadaposition__] = __iarmadaposition__

  /** ATTRIBUTES */
  readonly type = PositionType.Armada
  readonly id: IArmadaPositionId
  readonly pool: IArmadaVault
  readonly amount: ITokenAmount
  readonly shares: ITokenAmount
  readonly deposits: ITokenAmount[]
  readonly withdrawals: ITokenAmount[]

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
  }
}

SerializationService.registerClass(ArmadaPosition, { identifier: 'ArmadaPosition' })
