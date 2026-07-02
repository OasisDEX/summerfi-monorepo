import { LendingPosition } from '../../lending-protocols/implementation/LendingPosition'
import { ILendingPoolData } from '../../lending-protocols/interfaces/ILendingPool'
import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { LendingPositionType } from '../../lending-protocols/types/LendingPositionType'
import { TokenAmount } from '../implementation/TokenAmount'
import { ITokenAmount } from '../interfaces/ITokenAmount'
import { PositionType } from '../enums/PositionType'

// TODO: add a proper internal position type only used by the simulator that can be instantiated
// TODO implement Simulated position

/**
 * Creates an empty lending position (zero collateral and debt) for a given pool.
 *
 * @param pool - The lending pool the position belongs to.
 * @returns A new lending position with zeroed amounts.
 */
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

/**
 * Returns a copy of the position with the deposited amount added to its collateral.
 *
 * @param position - The position to deposit into.
 * @param amount - The collateral amount to add.
 * @returns A new position with increased collateral.
 */
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

/**
 * Returns a copy of the position with the withdrawn amount subtracted from its collateral.
 *
 * @param position - The position to withdraw from.
 * @param amount - The collateral amount to remove.
 * @returns A new position with decreased collateral.
 */
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

/**
 * Returns a copy of the position with the borrowed amount added to its debt.
 *
 * @param position - The position to borrow against.
 * @param amount - The debt amount to add.
 * @returns A new position with increased debt.
 */
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

/**
 * Returns a copy of the position with the repaid amount subtracted from its debt.
 *
 * @param position - The position to repay.
 * @param amount - The debt amount to remove.
 * @returns A new position with decreased debt.
 */
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
