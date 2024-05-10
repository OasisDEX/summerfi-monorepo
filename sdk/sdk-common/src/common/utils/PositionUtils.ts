import { TokenAmount } from '../implementation/TokenAmount'
import { Position } from '../implementation/Position'
import { PositionType } from '../enums/PositionType'
import { ILendingPoolData } from '../../protocols/interfaces/ILendingPool'
import { IPosition } from '../interfaces/IPosition'
import { ITokenAmount } from '../interfaces/ITokenAmount'

// TODO: add a proper internal position type only used by the simulator that can be instantiated

export function newEmptyPositionFromPool(pool: ILendingPoolData): IPosition {
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

export function depositToPosition(position: IPosition, amount: ITokenAmount): IPosition {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.add(amount),
    pool: position.pool,
  } as unknown as Position
}

export function withdrawFromPosition(position: IPosition, amount: ITokenAmount): IPosition {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.subtract(amount),
    pool: position.pool,
  } as unknown as Position
}

export function borrowFromPosition(position: IPosition, amount: ITokenAmount): IPosition {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount.add(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  } as unknown as Position
}

export function repayPositionDebt(position: IPosition, amount: ITokenAmount): IPosition {
  return {
    type: PositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount.subtract(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  } as unknown as Position
}
