import { IToken, TokenSchema, isToken } from '../../common/interfaces/IToken'
import { IPoolId, isPoolId } from './IPoolId'
import { z } from 'zod'
import { ProtocolSchema } from './IProtocol'

/**
 * @interface ILendingPoolId
 * @description Identifies a generic lending pool. This will be specialized for each protocol
 *
 * This is meant to be used for single pair collateral/debt lending pools. For multi-collateral pools,
 * a different interface should be used
 */
export interface ILendingPoolId extends IPoolId {
  /** Collateral token used to collateralized the pool */
  collateral: IToken
  /** Debt token, which can be borrowed from the pool */
  debt: IToken
}

/**
 * @description Type guard for ILendingPoolId
 * @param maybePoolId Object to be checked
 * @returns true if the object is an ILendingPoolId
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPoolId
 */
export function isLendingPoolId(maybePoolId: unknown): maybePoolId is ILendingPoolId {
  return (
    typeof maybePoolId === 'object' &&
    maybePoolId !== null &&
    isPoolId(maybePoolId) &&
    'collateral' in maybePoolId &&
    isToken(maybePoolId.collateral) &&
    'debt' in maybePoolId &&
    isToken(maybePoolId.debt)
  )
}

/**
 * @description Zod schema for ILendingPoolId
 */
export const LendingPoolIdSchema = z.object({
  protocol: ProtocolSchema,
  collateral: TokenSchema,
  debt: TokenSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ILendingPoolId = {} as z.infer<typeof LendingPoolIdSchema>
