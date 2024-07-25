import { IToken, TokenDataSchema } from '@summerfi/sdk-common'
import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { AaveV3ProtocolDataSchema, IAaveV3Protocol } from './IAaveV3Protocol'

/**
 * @interface IAaveV3LendingPoolId
 * @description Identifier of a lending pool on the Aave v3 protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3LendingPoolId extends ILendingPoolId, IAaveV3LendingPoolIdData {
  /** Aave v3 protocol */
  readonly protocol: IAaveV3Protocol
  /** The pool's efficiency mode */
  readonly emodeType: EmodeType
  /** The token used to collateralized the position */
  readonly collateralToken: IToken
  /** The token used to borrow funds */
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IAaveV3LendingPoolId
 */
export const AaveV3LendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: AaveV3ProtocolDataSchema,
  emodeType: EmodeTypeSchema,
  collateralToken: TokenDataSchema,
  debtToken: TokenDataSchema,
})

/**
 * Type for the data part of IAaveV3LendingPoolId
 */
export type IAaveV3LendingPoolIdData = Readonly<z.infer<typeof AaveV3LendingPoolIdDataSchema>>

/**
 * @description Type guard for IAaveV3LendingPoolId
 * @param maybePoolId
 * @returns true if the object is an IAaveV3LendingPoolId
 */
export function isAaveV3LendingPoolId(maybePoolId: unknown): maybePoolId is IAaveV3LendingPoolId {
  return AaveV3LendingPoolIdDataSchema.safeParse(maybePoolId).success
}
