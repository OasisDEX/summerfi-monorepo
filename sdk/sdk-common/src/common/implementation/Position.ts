import { SerializationService } from '~sdk-common/services/SerializationService'
import type { PositionId } from '~sdk-common/common/implementation/PositionId'
import type { RiskRatio } from '~sdk-common/common/implementation/RiskRatio'
import type { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'
import type { IPool } from '~sdk-common/protocols/interfaces/IPool'

interface IPositionSerialized {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: IPool
}

// we should add assests prop instead of the amounts
export class Position implements IPositionSerialized {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: IPool

  constructor(params: IPositionSerialized) {
    this.positionId = params.positionId
    this.debtAmount = params.debtAmount
    this.collateralAmount = params.collateralAmount
    this.pool = params.pool
  }

  static createFrom(params: IPositionSerialized): Position {
    return new Position(params)
  }

  get riskRatio(): RiskRatio {
    // TODO: Implement risk ratio calculation
    throw new Error('Not implemented')
  }
}

SerializationService.registerClass(Position)
