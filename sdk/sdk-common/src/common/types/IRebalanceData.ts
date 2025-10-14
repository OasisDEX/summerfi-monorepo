import { z } from 'zod'
import { AddressDataSchema } from '../interfaces/IAddress'
import type { IAddress } from '../interfaces/IAddress'
import { TokenAmountDataSchema } from '../interfaces/ITokenAmount'
import type { ITokenAmount } from '../interfaces/ITokenAmount'
import type { HexData } from './HexData'

/**
 * @name IRebalanceData
 * @description Data structure for rebalancing assets, used by Keepers of a fleet
 */
export interface IRebalanceData {
  /** Signature to differentiate from similar interfaces */
  /** Ark where the tokens are taken from */
  readonly fromArk: IAddress
  /** Ark where the tokens are moved to */
  readonly toArk: IAddress
  /** Amount of tokens to be moved */
  readonly amount: ITokenAmount
  /** Board data */
  readonly boardData?: HexData
  /** Disembark data */
  readonly disembarkData?: HexData
}

/**
 * @description Zod schema for IRebalanceData
 */
export const RebalanceDataSchema = z.object({
  fromArk: AddressDataSchema,
  toArk: AddressDataSchema,
  amount: TokenAmountDataSchema,
})

/**
 * Type definition for the RebalanceData data
 */
export type IRebalanceDataData = Readonly<z.infer<typeof RebalanceDataSchema>>

/**
 * @description Type guard for IRebalanceData
 * @param maybeRebalanceData
 * @returns true if the object is an IRebalanceData
 */
export function isRebalanceData(maybeRebalanceData: unknown): maybeRebalanceData is IRebalanceData {
  const zodReturn = RebalanceDataSchema.safeParse(maybeRebalanceData)

  return zodReturn.success
}
