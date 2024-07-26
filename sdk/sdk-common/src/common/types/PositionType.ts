import { z } from 'zod'

/**
 * @enum PositionType
 * @description Indicates the type of position
 */
export enum PositionType {
  /** Staking position: adding 1 token to the pool generates some interest earnings */
  Supply = 'Supply',
  /** Lending position, adding some collateral allows to borrow some debt */
  Lending = 'Lending',
  /** Armada Protocol position, aggregated liquidity */
  Earn = 'Earn',
}

/**
 * Zod schema for PositionType
 */
export const PositionTypeSchema = z.nativeEnum(PositionType)

/**
 * Type for the data part of PositionType
 */
export type IPositionTypeData = Readonly<z.infer<typeof PositionTypeSchema>>

/**
 * Type guard for PositionType
 * @param maybePositionType Object to be checked
 * @returns true if the object is a PositionType
 */
export function isPositionType(maybePositionType: unknown): maybePositionType is PositionType {
  return PositionTypeSchema.safeParse(maybePositionType).success
}
