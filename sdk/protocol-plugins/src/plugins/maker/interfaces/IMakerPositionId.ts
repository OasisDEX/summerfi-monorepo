import { MakerVaultId, MakerVaultIdSchema } from '../types/MakerVaultId'
import { IPositionId, PositionIdDataSchema } from '@summerfi/sdk-common'
import { z } from 'zod'
/**
 * @interface IMakerPositionId
 * @description Identifier of a Maker position
 */
export interface IMakerPositionId extends IPositionId, IMakerPositionIdData {
  /** The vault ID that identifies the position on Maker */
  readonly vaultId: MakerVaultId
}

/**
 * @description Zod schema for IMakerPositionId
 */
export const MakerPositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
  vaultId: MakerVaultIdSchema,
})

/**
 * Type for the data part of IMakerPositionId
 */
export type IMakerPositionIdData = Readonly<z.infer<typeof MakerPositionIdDataSchema>>

/**
 * @description Type guard for IMakerPositionId
 * @param maybeMakerPositionId Object to be checked
 * @returns true if the object is a IMakerPositionId
 */
export function isMakerPositionId(
  maybeMakerPositionId: unknown,
): maybeMakerPositionId is IMakerPositionId {
  return MakerPositionIdDataSchema.safeParse(maybeMakerPositionId).success
}
