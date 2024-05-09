import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/protocols'
import { IMorphoProtocol, MorphoProtocolDataSchema } from './IMorphoProtocol'
import { AddressDataSchema, IToken, PercentageDataSchema } from '@summerfi/sdk-common'
import { IAddress, IPercentage } from '@summerfi/sdk-common/common'
import { z } from 'zod'

/**
 * @interface IMorphoLendingPoolId
 * @description Identifier of a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolId extends IMorphoLendingPoolIdData, ILendingPoolId {
  /** The protocol to which the pool belongs */
  readonly protocol: IMorphoProtocol
  /** The oracle used in the Morpho market */
  readonly oracle: IAddress
  /** The interest rate module used in the Morpho market */
  readonly irm: IAddress
  /** The liquidation LTV for the Morpho market */
  readonly lltv: IPercentage

  // Re-declaring the properties with the correct types
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMorphoLendingPoolId
 */
export const MorphoLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: MorphoProtocolDataSchema,
  oracle: AddressDataSchema,
  irm: AddressDataSchema,
  lltv: PercentageDataSchema,
})

/**
 * Type for the data part of the IMorphoLendingPoolId interface
 */
export type IMorphoLendingPoolIdData = Readonly<z.infer<typeof MorphoLendingPoolIdDataSchema>>

/**
 * @description Type guard for IMorphoLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an IMorphoLendingPoolId
 */
export function isMorphoLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is IMorphoLendingPoolIdData {
  return MorphoLendingPoolIdDataSchema.safeParse(maybeLendingPoolId).success
}
