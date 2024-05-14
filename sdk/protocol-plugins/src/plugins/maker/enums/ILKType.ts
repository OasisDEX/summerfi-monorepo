import { z } from 'zod'

/**
 * @enum ILKType
 * @description Enum for the different ILK types in the Maker protocol
 */
export enum ILKType {
  ETH_A = 'ETH-A',
  ETH_B = 'ETH-B',
  ETH_C = 'ETH-C',
  WBTC_A = 'WBTC-A',
  WBTC_B = 'WBTC-B',
  WBTC_C = 'WBTC-C',
  WSTETH_A = 'WSTETH-A',
  WSTETH_B = 'WSTETH-B',
  RETH_A = 'RETH-A',
}

/**
 * @description Zod schema for ILKType
 */
export const ILKTypeSchema = z.nativeEnum(ILKType)

/**
 * @description Type guard for ILKType
 * @param maybeILKType Object to be checked
 * @returns true if the object is an ILKType
 */
export function isILKType(maybeILKType: unknown): maybeILKType is ILKType {
  return ILKTypeSchema.safeParse(maybeILKType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ILKType = {} as z.infer<typeof ILKTypeSchema>
