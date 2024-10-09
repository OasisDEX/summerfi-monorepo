import {
  AddressDataSchema,
  HexData,
  IAddress,
  ITokenAmount,
  TokenAmountDataSchema,
} from '@summerfi/sdk-common/common'
import { isHex } from 'viem'
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
  /** Data to be passed to the `board` function of the `toArk` */
  readonly boardData: HexData
  /** Data to be passed to the `disembark` function of the `fromArk` */
  readonly disembarkData: HexData
}

/**
 * @description Zod schema for IArmadaRebalanceData
 */
export const ArmadaRebalanceDataSchema = z.object({
  fromArk: AddressDataSchema,
  toArk: AddressDataSchema,
  amount: TokenAmountDataSchema,
  boardData: z.custom<HexData>((val) => isHex(val)),
  disembarkData: z.custom<HexData>((val) => isHex(val)),
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
