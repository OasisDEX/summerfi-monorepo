import { IProtocol, ProtocolSchema, isProtocol } from '../../protocols/interfaces/IProtocol'
import { z } from 'zod'

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 *
 * It is a way to retrieve a pool from the protocol and it should include all the necessary information
 * to uniquely identify a pool
 */
export interface IPoolId {
  protocol: IProtocol
}

/**
 * @description Type guard for IPoolId
 * @param maybePoolId
 * @returns true if the object is an IPoolId
 */
export function isPoolId(maybePoolId: unknown): maybePoolId is IPoolId {
  return (
    typeof maybePoolId === 'object' &&
    maybePoolId !== null &&
    'protocol' in maybePoolId &&
    isProtocol(maybePoolId.protocol)
  )
}

/**
 * @description Zod schema for IPoolId
 */
export const PoolIdSchema = z.object({
  protocol: ProtocolSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPoolId = {} as z.infer<typeof PoolIdSchema>
