import { IToken, ITokenData, TokenSchema } from '../../common/interfaces/IToken'
import { IPoolId, IPoolIdData } from './IPoolId'
import { IProtocol, ProtocolSchema } from './IProtocol'
import { z } from 'zod'

/**
 * @interface ILendingPoolIdData
 * @description Identifies a generic lending pool. This will be specialized for each protocol
 *
 * This is meant to be used for single pair collateral/debt lending pools. For multi-collateral pools,
 * a different interface should be used
 */
export interface ILendingPoolIdData extends IPoolIdData {
  /** Collateral token used to collateralized the pool */
  readonly collateralToken: ITokenData
  /** Debt token, which can be borrowed from the pool */
  readonly debtToken: ITokenData
}

/**
 * @name ILendingPoolId
 * @description Interface for the implementors of the lending pool ID
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ILendingPoolId extends IPoolId, ILendingPoolIdData {
  readonly protocol: IProtocol
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for ILendingPoolId
 */
export const LendingPoolIdSchema = z.object({
  protocol: ProtocolSchema,
  collateralToken: TokenSchema,
  debtToken: TokenSchema,
})

/**
 * @description Type guard for ILendingPoolId
 * @param maybePoolId Object to be checked
 * @returns true if the object is an ILendingPoolId
 *
 * It also asserts the type so that TypeScript knows that the object is an ILendingPoolId
 */
export function isLendingPoolId(maybePoolId: unknown): maybePoolId is ILendingPoolIdData {
  return LendingPoolIdSchema.safeParse(maybePoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ILendingPoolIdData = {} as z.infer<typeof LendingPoolIdSchema>
