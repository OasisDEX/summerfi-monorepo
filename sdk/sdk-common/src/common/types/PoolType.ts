import { z } from 'zod'

/**
 * @enum PoolType
 * @description Indicates the type of pool (supply or lending)
 */
export enum PoolType {
  /** Staking pool: adding 1 token to the pool generates some interest earnings */
  Supply = 'Supply',
  /** Lending pool, adding some collateral allows to borrow some debt */
  Lending = 'Lending',
}

/**
 * Zod schema for PoolType
 */
export const PoolTypeSchema = z.nativeEnum(PoolType)

/**
 * Type guard for PoolType
 * @param maybePoolType Object to be checked
 * @returns true if the object is a PoolType
 */
export function isPoolType(maybePoolType: unknown): maybePoolType is PoolType {
  return PoolTypeSchema.safeParse(maybePoolType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: PoolType = {} as z.infer<typeof PoolTypeSchema>
