import { TokenDataSchema } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { ILKType, ILKTypeSchema } from '../enums'
import { IMakerProtocol, MakerProtocolDataSchema } from './IMakerProtocol'

/**
 * @name IMakerLendingPoolId
 * @description Represents a lending pool's ID for the Maker protocol
 *
 * It includes the ILK type which will determine which pool will be used
 */
export interface IMakerLendingPoolId extends ILendingPoolId, IMakerLendingPoolIdData {
  /** The Maker protocol */
  readonly protocol: IMakerProtocol
  /** The ILK type of the pool */
  readonly ilkType: ILKType
  /** The token used to collateralize the position */
  readonly collateralToken: IToken
  /** The token used to borrow funds */
  readonly debtToken: IToken
}

/**
 * @description Zod schema for IMakerLendingPoolId
 */
export const MakerLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: MakerProtocolDataSchema,
  ilkType: ILKTypeSchema,
  collateralToken: TokenDataSchema,
  debtToken: TokenDataSchema,
})

/**
 * Type for the data part of IMakerLendingPoolId
 */
export type IMakerLendingPoolIdData = Readonly<z.infer<typeof MakerLendingPoolIdDataSchema>>

/**
 * @description Type guard for IMakerLendingPoolId
 * @param maybePoolId
 * @returns true if the object is an IMakerLendingPoolId
 */
export function isMakerLendingPoolId(maybePoolId: unknown): maybePoolId is IMakerLendingPoolId {
  return MakerLendingPoolIdDataSchema.safeParse(maybePoolId).success
}
