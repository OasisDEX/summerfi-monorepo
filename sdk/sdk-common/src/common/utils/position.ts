import { LendingPool } from '../../protocols/interfaces/LendingPool'
import { TokenAmount } from '../implementation'
import { Position } from '../implementation/Position'

export function newEmptyPositionFromPool(pool: LendingPool): Position {
  return new Position({
    positionId: {
      id: 'newEmptyPositionFromPool',
    },
    debtAmount: TokenAmount.createFrom({ token: pool.debtTokens[0], amount: '0' }),
    collateralAmount: TokenAmount.createFrom({ token: pool.collateralTokens[0], amount: '0' }),
    pool,
  })
}

export function depositToPosition(position: Position, amount: TokenAmount): Position {
  return new Position({
    positionId: position.positionId,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.add(amount),
    pool: position.pool,
  })
}

export function withdrawFromPosition(position: Position, amount: TokenAmount): Position {
  return new Position({
    positionId: position.positionId,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.subtract(amount),
    pool: position.pool,
  })
}

export function borrowFromPosition(position: Position, amount: TokenAmount): Position {
  return new Position({
    positionId: position.positionId,
    debtAmount: position.debtAmount.add(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  })
}

export function repayPositionDebt(position: Position, amount: TokenAmount): Position {
  return new Position({
    positionId: position.positionId,
    debtAmount: position.debtAmount.subtract(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  })
}
