import { IProtocol, IProtocolData, ProtocolSchema } from '../../protocols/interfaces/IProtocol'
import { z } from 'zod'

/**
 * @name IPoolIdData
 * @description Represents a pool's ID. This will be specialized for each protocol
 *
 * It is a way to retrieve a pool from the protocol and it should include all the necessary information
 * to uniquely identify a pool
 */
export interface IPoolIdData {
  /** Protocol where the pool is */
  protocol: IProtocolData
}

/**
 * @name IPoolId
 * @description Interface for the implementors of the pool ID
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPoolId extends IPoolIdData {
  readonly protocol: IProtocol
}

/**
 * @description Zod schema for IPoolId
 */
export const PoolIdSchema = z.object({
  protocol: ProtocolSchema,
})

/**
 * @description Type guard for IPoolId
 * @param maybePoolId
 * @returns true if the object is an IPoolId
 */
export function isPoolId(maybePoolId: unknown): maybePoolId is IPoolIdData {
  return PoolIdSchema.safeParse(maybePoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPoolIdData = {} as z.infer<typeof PoolIdSchema>
