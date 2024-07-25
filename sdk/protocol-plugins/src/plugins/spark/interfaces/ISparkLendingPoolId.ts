import { TokenDataSchema } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { ISparkProtocol, SparkProtocolDataSchema } from './ISparkProtocol'

/**
 * @interface ISparkLendingPoolId
 * @description Identifier of a lending pool in the Spark protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPoolId extends ISparkLendingPoolIdData, ILendingPoolId {
  /** The protocol to which the pool belongs */
  readonly protocol: ISparkProtocol
  /** The efficiency mode of the pool */
  readonly emodeType: EmodeType
  /** The token used to collateralize the position */
  readonly collateralToken: IToken
  /** The token used to borrow funds */
  readonly debtToken: IToken
}

/**
 * @description Zod schema for ISparkLendingPoolId
 */
export const SparkLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: SparkProtocolDataSchema,
  emodeType: EmodeTypeSchema,
  collateralToken: TokenDataSchema,
  debtToken: TokenDataSchema,
})

/**
 * Type for the data part of ISparkLendingPoolId
 */
export type ISparkLendingPoolIdData = Readonly<z.infer<typeof SparkLendingPoolIdDataSchema>>

/**
 * @description Type guard for ISparkLendingPoolId
 * @param poolId Object to be checked
 * @returns true if the object is an ISparkLendingPoolId
 */
export function isSparkLendingPoolId(
  maybeLendingPoolId: unknown,
): maybeLendingPoolId is ISparkLendingPoolId {
  return SparkLendingPoolIdDataSchema.safeParse(maybeLendingPoolId).success
}
