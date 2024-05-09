import {
  ILendingPoolId,
  ILendingPoolIdData,
  LendingPoolIdDataSchema,
} from '@summerfi/sdk-common/protocols'
import { EmodeType, EmodeTypeSchema } from '../../common/enums/EmodeType'
import { AaveV3ProtocolSchema, IAaveV3Protocol, IAaveV3ProtocolData } from './IAaveV3Protocol'
import { z } from 'zod'
import { IToken } from '@summerfi/sdk-common'

/**
 * @interface IAaveV3LendingPoolIdData
 * @description Identifier of a lending pool on the Aave v3 protocol
 */
export interface IAaveV3LendingPoolIdData extends ILendingPoolIdData {
  /** Aave v3 protocol */
  readonly protocol: IAaveV3ProtocolData
  /** The pool's efficiency mode */
  readonly emodeType: EmodeType
}

/**
 * @interface IAaveV3LendingPoolId
 * @description Interface for the implementors of the lending pool id
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IAaveV3LendingPoolId extends ILendingPoolId, IAaveV3LendingPoolIdData {
  readonly protocol: IAaveV3Protocol
  readonly emodeType: EmodeType

  // Re-declaring the properties with the correct types
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IAaveV3LendingPoolId
 */
export const AaveV3LendingPoolIdSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: AaveV3ProtocolSchema,
  emodeType: EmodeTypeSchema,
})

/**
 * @description Type guard for IAaveV3LendingPoolId
 * @param maybePoolId
 * @returns true if the object is an IAaveV3LendingPoolId
 */
export function isAaveV3LendingPoolId(
  maybePoolId: unknown,
): maybePoolId is IAaveV3LendingPoolIdData {
  return AaveV3LendingPoolIdSchema.safeParse(maybePoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAaveV3LendingPoolIdData = {} as z.infer<typeof AaveV3LendingPoolIdSchema>
