import {
  ILendingPoolId,
  ILendingPoolIdData,
  LendingPoolIdDataSchema,
} from '@summerfi/sdk-common/protocols'
import { ILKType, ILKTypeSchema } from '../enums'
import { IMakerProtocol, IMakerProtocolData, MakerProtocolSchema } from './IMakerProtocol'
import { z } from 'zod'
import { ITokenData, TokenDataSchema } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'

/**
 * @name IMakerLendingPoolIdData
 * @description Represents a lending pool's ID for the Maker protocol
 *
 * It includes the ILK type which will determine which pool will be used
 */
export interface IMakerLendingPoolIdData extends ILendingPoolIdData {
  /** The Maker protocol */
  readonly protocol: IMakerProtocolData
  /** The ILK type of the pool */
  readonly ilkType: ILKType
  /** The token used to collateralize the position */
  readonly collateralToken: ITokenData
  /** The token used to borrow funds */
  readonly debtToken: ITokenData
}

/**
 * @name IMakerLendingPoolId
 * @description Interface for the implementors of the lending pool ID
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMakerLendingPoolId extends ILendingPoolId, IMakerLendingPoolIdData {
  readonly protocol: IMakerProtocol
  readonly ilkType: ILKType
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMakerLendingPoolId
 */
export const MakerLendingPoolIdSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: MakerProtocolSchema,
  ilkType: ILKTypeSchema,
  collateralToken: TokenDataSchema,
  debtToken: TokenDataSchema,
})

/**
 * @description Type guard for IMakerLendingPoolId
 * @param maybePoolId
 * @returns true if the object is an IMakerLendingPoolId
 */
export function isMakerLendingPoolId(maybePoolId: unknown): maybePoolId is IMakerLendingPoolIdData {
  return MakerLendingPoolIdSchema.safeParse(maybePoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerLendingPoolIdData = {} as z.infer<typeof MakerLendingPoolIdSchema>
