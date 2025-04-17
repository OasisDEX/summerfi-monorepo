import { ILendingPositionId, LendingPositionIdDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
import { MakerVaultId, MakerVaultIdSchema } from '../types/MakerVaultId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMakerLendingPositionId
 * @description Identifier of a Maker lending position
 */
export interface IMakerLendingPositionId extends ILendingPositionId, IMakerLendingPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The vault ID that identifies the position on Maker */
  readonly vaultId: MakerVaultId
}

/**
 * @description Zod schema for IMakerLendingPositionId
 */
export const MakerLendingPositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
  vaultId: MakerVaultIdSchema,
})

/**
 * Type for the data part of IMakerLendingPositionId
 */
export type IMakerLendingPositionIdData = Readonly<z.infer<typeof MakerLendingPositionIdDataSchema>>

/**
 * @description Type guard for IMakerLendingPositionId
 * @param maybeMakerLendingPositionId Object to be checked
 * @returns true if the object is a IMakerLendingPositionId
 */
export function isMakerLendingPositionId(
  maybeMakerLendingPositionId: unknown,
): maybeMakerLendingPositionId is IMakerLendingPositionId {
  return MakerLendingPositionIdDataSchema.safeParse(maybeMakerLendingPositionId).success
}
