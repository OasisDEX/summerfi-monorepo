import { LendingPool } from '../../protocols/implementation/LendingPool'
import { TokenAmount } from '../implementation/TokenAmount'
import { Position } from '../implementation/Position'
import { Token } from '../implementation/Token'
import { PositionType } from '../enums/PositionType'

export function newEmptyPositionFromPool(
  pool: LendingPool,
  debt: Token,
  collateral: Token,
): Position {
  const debtConfig = pool.debts.get({ token: debt })
  const collateralConfig = pool.collaterals.get({ token: collateral })

  if (!debtConfig) {
    throw new Error('Debt token not supported by pool')
  }
  if (!collateralConfig) {
    throw new Error('Collateral token not supported by pool')
  }

  return Position.createFrom({
    type: PositionType.Multiply,
    positionId: {
      id: 'newEmptyPositionFromPool',
    },
    debtAmount: TokenAmount.createFrom({ token: debtConfig.token, amount: '0' }),
    collateralAmount: TokenAmount.createFrom({ token: collateralConfig.token, amount: '0' }),
    pool,
  })
}

export function depositToPosition(position: Position, amount: TokenAmount): Position {
  return Position.createFrom({
    type: PositionType.Multiply,
    positionId: position.positionId,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.add(amount),
    pool: position.pool,
  })
}

export function withdrawFromPosition(position: Position, amount: TokenAmount): Position {
  return Position.createFrom({
    type: PositionType.Multiply,
    positionId: position.positionId,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.subtract(amount),
    pool: position.pool,
  })
}

export function borrowFromPosition(position: Position, amount: TokenAmount): Position {
  return Position.createFrom({
    type: PositionType.Multiply,
    positionId: position.positionId,
    debtAmount: position.debtAmount.add(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  })
}

export function repayPositionDebt(position: Position, amount: TokenAmount): Position {
  return Position.createFrom({
    type: PositionType.Multiply,
    positionId: position.positionId,
    debtAmount: position.debtAmount.subtract(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  })
}
