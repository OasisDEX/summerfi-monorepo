import { PoolType, isToken } from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'
import { ILendingPoolId, LendingPoolIdDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { ILKType, ILKTypeSchema } from '../enums'
import { IMakerProtocol, isMakerProtocol } from './IMakerProtocol'

/**
 * @name IMakerLendingPoolId
 * @description Represents a lending pool's ID for the Maker protocol
 *
 * It includes the ILK type which will determine which pool will be used
 */
export interface IMakerLendingPoolId extends ILendingPoolId, IMakerLendingPoolIdData {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_2: 'IMakerLendingPoolId'
  /** The Maker protocol */
  readonly protocol: IMakerProtocol
  /** The ILK type of the pool */
  readonly ilkType: ILKType
  /** The token used to collateralize the position */
  readonly collateralToken: IToken
  /** The token used to borrow funds */
  readonly debtToken: IToken

  // Re-declaring the properties with the correct types
  readonly type: PoolType
}

/**
 * @description Zod schema for IMakerLendingPoolId
 */
export const MakerLendingPoolIdDataSchema = z.object({
  ...LendingPoolIdDataSchema.shape,
  protocol: z.custom<IMakerProtocol>((val) => isMakerProtocol(val)),
  ilkType: ILKTypeSchema,
  collateralToken: z.custom<IToken>((val) => isToken(val)),
  debtToken: z.custom<IToken>((val) => isToken(val)),
})

/**
 * Type for the data part of IMakerLendingPoolId
 */
export type IMakerLendingPoolIdData = Readonly<z.infer<typeof MakerLendingPoolIdDataSchema>>

/**
 * Type for the parameters of the IMakerLendingPoolId interface
 */
export type IMakerLendingPoolIdParameters = Omit<IMakerLendingPoolIdData, 'type'>

/**
 * @description Type guard for IMakerLendingPoolId
 * @param maybePoolId
 * @returns true if the object is an IMakerLendingPoolId
 */
export function isMakerLendingPoolId(maybePoolId: unknown): maybePoolId is IMakerLendingPoolId {
  return MakerLendingPoolIdDataSchema.safeParse(maybePoolId).success
}
