import { IPoolId } from './IPoolId'
import { IProtocol, ProtocolDataSchema } from './IProtocol'
import { z } from 'zod'

/**
 * @name ILendingPoolId
 * @description Identifies a generic lending pool. This will be specialized for each protocol
 *
 * This is meant to be used for single pair collateral/debt lending pools. For multi-collateral pools,
 * a different interface should be used
 *
 * Note: Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ILendingPoolId extends IPoolId, ILendingPoolIdData {
  // Re-declaring narrowed types
  readonly protocol: IProtocol
}

/**
 * @description Zod schema for ILendingPoolId
 */
export const LendingPoolIdDataSchema = z.object({
  protocol: ProtocolDataSchema,
})

/**
 * Type for the data part of the ILendingPoolId interface
 */
export type ILendingPoolIdData = Readonly<z.infer<typeof LendingPoolIdDataSchema>>

/**
 * @description Type guard for ILendingPoolId
 * @param maybePoolId Object to be checked
 * @returns true if the object is an ILendingPoolId
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPoolId
 */
export function isLendingPoolId(maybePoolId: unknown): maybePoolId is ILendingPoolId {
  return LendingPoolIdDataSchema.safeParse(maybePoolId).success
}
