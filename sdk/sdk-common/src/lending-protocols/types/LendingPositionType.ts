import { z } from 'zod'

/**
 * @enum LendingPositionType
 * @description Indicates the type of lending position in the Summer system
 */
export enum LendingPositionType {
  /** Simple borrow with added collateral */
  Borrow = 'Borrow',
  /** Borrow with leveraged collateral */
  Multiply = 'Multiply',
  /** Yield loops */
  Earn = 'Earn',
}

/**
 * Zod schema for LendingPositionType
 */
export const LendingPositionTypeSchema = z.nativeEnum(LendingPositionType)

/**
 * Type for the data part of LendingPositionType
 */
export type ILendingPositionTypeData = Readonly<z.infer<typeof LendingPositionTypeSchema>>

/**
 * Type guard for LendingPositionType
 * @param maybeLendingPositionType Object to be checked
 * @returns true if the object is a LendingPositionType
 */
export function isLendingPositionType(
  maybeLendingPositionType: unknown,
): maybeLendingPositionType is LendingPositionType {
  return LendingPositionTypeSchema.safeParse(maybeLendingPositionType).success
}
