import {
  ILendingPoolId,
  ILendingPoolIdData,
  LendingPoolIdSchema,
} from '@summerfi/sdk-common/protocols'
import { IMorphoProtocol, IMorphoProtocolData, MorphoProtocolSchema } from './IMorphoProtocol'
import {
  Address,
  AddressSchema,
  IAddressData,
  IPercentageData,
  IToken,
  Percentage,
  PercentageSchema,
} from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMorphoLendingPoolIdData
 * @description Identifier of a lending pool in the Morpho protocol
 */
export interface IMorphoLendingPoolIdData extends ILendingPoolIdData {
  /** The protocol to which the pool belongs */
  readonly protocol: IMorphoProtocolData
  /** The oracle used in the Morpho market */
  readonly oracle: IAddressData
  /** The interest rate module used in the Morpho market */
  readonly irm: IAddressData
  /** The liquidation LTV for the Morpho market */
  readonly lltv: IPercentageData
}

/**
 * @interface IMorphoLendingPoolId
 * @description Interface for the implementors of the lending pool id
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPoolId extends IMorphoLendingPoolIdData, ILendingPoolId {
  readonly protocol: IMorphoProtocol

  // Re-declaring the properties with the correct types
  readonly collateralToken: IToken
  readonly debtToken: IToken
  readonly oracle: Address
  readonly irm: Address
  readonly lltv: Percentage
}

/**
 * @description Zod schema for IMorphoLendingPoolId
 */
export const MorphoLendingPoolIdSchema = z.object({
  ...LendingPoolIdSchema.shape,
  protocol: MorphoProtocolSchema,
  oracle: AddressSchema,
  irm: AddressSchema,
  lltv: PercentageSchema,
})

/**
 * @description Type guard for IMorphoLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an IMorphoLendingPoolId
 */
export function isMorphoLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is IMorphoLendingPoolIdData {
  return MorphoLendingPoolIdSchema.safeParse(maybeLendingPoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMorphoLendingPoolIdData = {} as z.infer<typeof MorphoLendingPoolIdSchema>
