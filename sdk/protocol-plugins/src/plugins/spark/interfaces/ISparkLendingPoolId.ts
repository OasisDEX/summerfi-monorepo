import { ILendingPoolIdData } from '@summerfi/sdk-common/protocols'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { ISparkProtocol, ISparkProtocolData, SparkProtocolSchema } from './ISparkProtocol'
import { LendingPoolIdSchema } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface ISparkLendingPoolIdData
 * @description Identifier of a lending pool in the Spark protocol
 */
export interface ISparkLendingPoolIdData extends ILendingPoolIdData {
  /** The protocol to which the pool belongs */
  readonly protocol: ISparkProtocolData
  /** The efficiency mode of the pool */
  readonly emodeType: EmodeType
}

/**
 * @interface ISparkLendingPoolId
 * @description Interface for the implementors of the lending pool id
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ISparkLendingPoolId extends ISparkLendingPoolIdData {
  readonly protocol: ISparkProtocol
  readonly emodeType: EmodeType
}

/**
 * @description Zod schema for ISparkLendingPoolId
 */
export const SparkLendingPoolIdSchema = z.object({
  ...LendingPoolIdSchema.shape,
  protocol: SparkProtocolSchema,
  emodeType: EmodeTypeSchema,
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
