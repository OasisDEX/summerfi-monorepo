import { PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPositionId,
  LendingPositionIdDataSchema,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'

/**
 * @interface ISparkPositionId
 * @description Represents the ID of a position in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkLendingPositionId extends ILendingPositionId, ISparkLendingPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'ISparkLendingPositionId'
  // Re-declaring the properties with the correct types
  readonly type: PositionType
}

/**
 * @description Zod schema for ISparkPositionId
 */
export const SparkLendingPositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
})

/**
 * Type for the data part of ISparkPositionId
 */
export type ISparkLendingPositionIdData = Readonly<z.infer<typeof SparkLendingPositionIdDataSchema>>

/**
 * Type for the parameters of ISparkPositionId
 */
export type ISparkLendingPositionIdParameters = Omit<ISparkLendingPositionIdData, 'type'>

/**
 * @description Type guard for ISparkPositionId
 * @param maybeSparkLendingPositionId
 * @returns true if the object is an ISparkPositionId
 */
export function isSparkLendingPositionId(
  maybeSparkLendingPositionId: unknown,
): maybeSparkLendingPositionId is ISparkLendingPositionId {
  return SparkLendingPositionIdDataSchema.safeParse(maybeSparkLendingPositionId).success
}
