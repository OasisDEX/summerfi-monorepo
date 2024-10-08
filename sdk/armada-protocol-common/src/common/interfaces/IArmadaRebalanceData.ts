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
 * @name IArmadaRebalanceData
 * @description Data structure for rebalancing assets, used by Keepers of a fleet
 */
export interface IArmadaRebalanceData {
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
 * @description Zod schema for IArmadaRebalanceData
 */
export const ArmadaRebalanceDataSchema = z.object({
  fromArk: AddressDataSchema,
  toArk: AddressDataSchema,
  amount: TokenAmountDataSchema,
})

/**
 * Type definition for the ArmadaRebalanceData data
 */
export type IArmadaRebalanceDataData = Readonly<z.infer<typeof ArmadaRebalanceDataSchema>>

/**
 * @description Type guard for IArmadaRebalanceData
 * @param maybeRebalanceData
 * @returns true if the object is an IArmadaRebalanceData
 */
export function isArmadaRebalanceData(
  maybeRebalanceData: unknown,
): maybeRebalanceData is IArmadaRebalanceData {
  const zodReturn = ArmadaRebalanceDataSchema.safeParse(maybeRebalanceData)

  return zodReturn.success
}
