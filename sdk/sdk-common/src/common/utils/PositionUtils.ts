import { LendingPosition } from '../../lending-protocols/implementation/LendingPosition'
import { ILendingPoolData } from '../../lending-protocols/interfaces/ILendingPool'
import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { LendingPositionType } from '../../lending-protocols/types/LendingPositionType'
import { TokenAmount } from '../implementation/TokenAmount'
import { ITokenAmount } from '../interfaces/ITokenAmount'
import { PositionType } from '../enums/PositionType'

// TODO: add a proper internal position type only used by the simulator that can be instantiated
// TODO implement Simulated position

export function newEmptyPositionFromPool(pool: ILendingPoolData): ILendingPosition {
  return {
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    id: {
      type: PositionType.Lending,
      id: 'newEmptyPositionFromPool',
    },
    debtAmount: TokenAmount.createFrom({ token: pool.debtToken, amount: '0' }),
    collateralAmount: TokenAmount.createFrom({ token: pool.collateralToken, amount: '0' }),
    pool,
  } as unknown as LendingPosition
}

export function depositToPosition(
  position: ILendingPosition,
  amount: ITokenAmount,
): ILendingPosition {
  return {
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    id: position.id,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.add(amount),
    pool: position.pool,
  } as unknown as LendingPosition
}

export function withdrawFromPosition(
  position: ILendingPosition,
  amount: ITokenAmount,
): ILendingPosition {
  return {
    type: PositionType.Lending,
    subtype: position.subtype,
    id: position.id,
    debtAmount: position.debtAmount,
    collateralAmount: position.collateralAmount.subtract(amount),
    pool: position.pool,
  } as unknown as LendingPosition
}

export function borrowFromPosition(
  position: ILendingPosition,
  amount: ITokenAmount,
): ILendingPosition {
  return {
    type: PositionType.Lending,
    subtype: position.subtype,
    id: position.id,
    debtAmount: position.debtAmount.add(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  } as unknown as LendingPosition
}

export function repayPositionDebt(
  position: ILendingPosition,
  amount: ITokenAmount,
): ILendingPosition {
  return {
    type: PositionType.Lending,
    subtype: position.subtype,
    id: position.id,
    debtAmount: position.debtAmount.subtract(amount),
    collateralAmount: position.collateralAmount,
    pool: position.pool,
  } as unknown as LendingPosition
}
