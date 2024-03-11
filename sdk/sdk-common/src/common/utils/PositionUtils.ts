import { LendingPool } from '../../protocols/implementation/LendingPool'
import { AddressValue } from "~sdk-common/common";
import { TokenAmount } from '../implementation/TokenAmount'
import { Position } from '../implementation/Position'

export function newEmptyPositionFromPool(pool: LendingPool, debtAddress: AddressValue, collateralAddress: AddressValue): Position {
  const debtConfig = pool.debts[debtAddress]
  const collateralConfig = pool.collaterals[collateralAddress]

  return new Position({
    positionId: {
      id: 'newEmptyPositionFromPool',
    },
    debtAmount: TokenAmount.createFrom({ token: debtConfig.token, amount: '0' }),
    collateralAmount: TokenAmount.createFrom({ token: collateralConfig.token, amount: '0' }),
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
