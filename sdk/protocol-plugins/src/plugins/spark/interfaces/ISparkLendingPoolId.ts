import { ILendingPoolId, IPoolId } from '@summerfi/sdk-common/protocols'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { ISparkProtocol, SparkProtocolSchema } from './ISparkProtocol'
import { LendingPoolIdSchema } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface ISparkLendingPoolId
 * @description Identifier of a lending pool in the Spark protocol
 */
export interface ISparkLendingPoolId extends ILendingPoolId {
  /** The protocol to which the pool belongs */
  protocol: ISparkProtocol
  /** The efficiency mode of the pool */
  emodeType: EmodeType
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
export function isSparkLendingPoolId(poolId: IPoolId): poolId is ISparkLendingPoolId {
  return SparkLendingPoolIdSchema.safeParse(poolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkLendingPoolId = {} as z.infer<typeof SparkLendingPoolIdSchema>
