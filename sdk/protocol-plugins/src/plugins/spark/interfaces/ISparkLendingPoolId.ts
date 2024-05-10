import {
  ILendingPoolId,
  ILendingPoolIdData,
  LendingPoolIdDataSchema,
} from '@summerfi/sdk-common/protocols'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { ISparkProtocol, ISparkProtocolData, SparkProtocolSchema } from './ISparkProtocol'
import { z } from 'zod'
import { IToken, ITokenData } from '@summerfi/sdk-common/common'
import { TokenDataSchema } from '@summerfi/sdk-common'

/**
 * @interface ISparkLendingPoolIdData
 * @description Identifier of a lending pool in the Spark protocol
 */
export interface ISparkLendingPoolIdData extends ILendingPoolIdData {
  /** The protocol to which the pool belongs */
  readonly protocol: ISparkProtocolData
  /** The efficiency mode of the pool */
  readonly emodeType: EmodeType
  /** The token used to collateralized the position */
  readonly collateralToken: ITokenData
  /** The token used to borrow funds */
  readonly debtToken: ITokenData
}

/**
 * @interface ISparkLendingPoolId
 * @description Interface for the implementors of the lending pool id
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPoolId extends ISparkLendingPoolIdData, ILendingPoolId {
  readonly protocol: ISparkProtocol
  readonly emodeType: EmodeType
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for ISparkLendingPoolId
 */
export const SparkLendingPoolIdSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: SparkProtocolSchema,
  emodeType: EmodeTypeSchema,
  collateralToken: TokenDataSchema,
  debtToken: TokenDataSchema,
})

/**
 * @description Type guard for ISparkLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an ISparkLendingPoolId
 */
export function isSparkLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is ISparkLendingPoolIdData {
  return SparkLendingPoolIdSchema.safeParse(maybeLendingPoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkLendingPoolIdData = {} as z.infer<typeof SparkLendingPoolIdSchema>
