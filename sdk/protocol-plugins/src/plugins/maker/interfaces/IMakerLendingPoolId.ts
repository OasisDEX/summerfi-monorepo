import { ILendingPoolId, LendingPoolIdSchema } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../enums'
import { z } from 'zod'
import { IMakerProtocol, MakerProtocolSchema } from './IMakerProtocol'

/**
 * @name IMakerLendingPoolId
 * @description Represents a lending pool's ID for the Maker protocol
 *
 * It includes the ILK type which will determine which pool will be used
 */
export interface IMakerLendingPoolId extends ILendingPoolId {
  /** The Maker protocol */
  protocol: IMakerProtocol
  /** The ILK type of the pool */
  ilkType: ILKType
}

/**
 * @description Zod schema for IMakerLendingPoolId
 */
export const MakerLendingPoolIdSchema = z.object({
  ...LendingPoolIdSchema.shape,
  protocol: MakerProtocolSchema,
  ilkType: z.nativeEnum(ILKType),
})

/**
 * @description Type guard for IMakerLendingPoolId
 * @param maybePoolId
 * @returns true if the object is an IMakerLendingPoolId
 */
export function isMakerLendingPoolId(maybePoolId: unknown): maybePoolId is IMakerLendingPoolId {
  return MakerLendingPoolIdSchema.safeParse(maybePoolId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerLendingPoolId = {} as z.infer<typeof MakerLendingPoolIdSchema>
