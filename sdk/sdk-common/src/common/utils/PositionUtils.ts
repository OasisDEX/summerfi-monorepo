import { TokenAmount } from '../implementation/TokenAmount'
import { Position } from '../implementation/Position'
import { PositionType } from '../enums/PositionType'
import { ILendingPoolData } from '../../protocols/interfaces/ILendingPool'

export function newEmptyPositionFromPool(pool: ILendingPoolData): Position {
  return {
    type: PositionType.Multiply,
    id: {
      id: 'newEmptyPositionFromPool',
    },
    debtAmount: TokenAmount.createFrom({ token: pool.id.debtToken, amount: '0' }),
    collateralAmount: TokenAmount.createFrom({ token: pool.id.collateralToken, amount: '0' }),
    pool,
  } as unknown as Position
}

export function depositToPosition(position: Position, amount: TokenAmount): Position {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.add(amount),
    pool: position.pool,
  } as unknown as Position
}

export function withdrawFromPosition(position: Position, amount: TokenAmount): Position {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.subtract(amount),
    pool: position.pool,
  } as unknown as Position
}

export function borrowFromPosition(position: Position, amount: TokenAmount): Position {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount.add(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  } as unknown as Position
}

export function repayPositionDebt(position: Position, amount: TokenAmount): Position {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount.subtract(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  } as unknown as Position
}
