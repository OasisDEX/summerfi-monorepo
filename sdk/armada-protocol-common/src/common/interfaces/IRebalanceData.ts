import {
  AddressDataSchema,
  IAddress,
  ITokenAmount,
  TokenAmountDataSchema,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IRebalanceData
 * @description Data structure for rebalancing assets, used by Keepers of a fleet
 */
export interface IRebalanceData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Ark where the tokens are taken from */
  readonly fromArk: IAddress
  /** Ark where the tokens are moved to */
  readonly toArk: IAddress
  /** Amount of tokens to be moved */
  readonly amount: ITokenAmount
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
export function isRebalanceData(
  maybeRebalanceData: unknown,
  returnedErrors?: string[],
): maybeRebalanceData is IRebalanceData {
  const zodReturn = RebalanceDataSchema.safeParse(maybeRebalanceData)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
