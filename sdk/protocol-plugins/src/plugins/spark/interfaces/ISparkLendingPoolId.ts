import { PoolType, isToken } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { ISparkProtocol, isSparkProtocol } from './ISparkProtocol'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __isparklendingpoolid__: unique symbol = Symbol()

/**
 * @interface ISparkLendingPoolId
 * @description Identifier of a lending pool in the Spark protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPoolId extends ISparkLendingPoolIdData, ILendingPoolId {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__isparklendingpoolid__]: 'ISparkLendingPoolId'
  /** The protocol to which the pool belongs */
  readonly protocol: ISparkProtocol
  /** The efficiency mode of the pool */
  readonly emodeType: EmodeType
  /** The token used to collateralize the position */
  readonly collateralToken: IToken
  /** The token used to borrow funds */
  readonly debtToken: IToken

  // Re-declaring the properties with the correct types
  readonly type: PoolType
}

/**
 * @description Zod schema for ISparkLendingPoolId
 */
export const SparkLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: z.custom<ISparkProtocol>((val) => isSparkProtocol(val)),
  emodeType: EmodeTypeSchema,
  collateralToken: z.custom<IToken>((val) => isToken(val)),
  debtToken: z.custom<IToken>((val) => isToken(val)),
})

/**
 * Type for the data part of ISparkLendingPoolId
 */
export type ISparkLendingPoolIdData = Readonly<z.infer<typeof SparkLendingPoolIdDataSchema>>

/**
 * Type for the parameters of the ISparkLendingPoolId interface
 */
export type ISparkLendingPoolIdParameters = Omit<ISparkLendingPoolIdData, 'type'>

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
