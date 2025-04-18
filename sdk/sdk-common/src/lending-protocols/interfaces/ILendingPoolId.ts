import { z } from 'zod'
import { IPoolId, PoolIdDataSchema } from '../../common/interfaces/IPoolId'
import { IProtocol, isProtocol } from '../../common/interfaces/IProtocol'
import { PoolType } from '../../common/enums/PoolType'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

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
  /** Signature to differentiate it from other interfaces */
  readonly [__signature__]: symbol
  // Re-declaring narrowed types
  readonly protocol: IProtocol

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Lending
}

/**
 * @description Zod schema for ILendingPoolId
 */
export const LendingPoolIdDataSchema = z.object({
  ...PoolIdDataSchema.shape,
  type: z.literal(PoolType.Lending),
  protocol: z.custom<IProtocol>((val) => isProtocol(val)),
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
