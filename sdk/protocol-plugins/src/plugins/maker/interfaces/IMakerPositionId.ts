import { IPositionIdData } from '@summerfi/sdk-common/common'
import { MakerVaultId, MakerVaultIdSchema } from '../types/MakerVaultId'
import { PositionIdSchema, isPositionId } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMakerPositionIdData
 * @description Identifier of a Maker position
 */
export interface IMakerPositionIdData extends IPositionIdData {
  /** The vault ID that identifies the position on Maker */
  vaultId: MakerVaultId
}

/**
 * @interface IMakerPositionId
 * @description Interface for the implementors of the position id
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IMakerPositionId extends IMakerPositionIdData {
  /** The vault ID that identifies the position on Maker */
  readonly vaultId: MakerVaultId
}

/**
 * @description Zod schema for IMakerPositionId
 */
export const MakerPositionIdSchema = z.object({
  ...PositionIdSchema.shape,
  vaultId: MakerVaultIdSchema,
})

/**
 * @description Type guard for IMakerPositionId
 * @param maybePositionId
 * @returns true if the object is an IMakerPositionId
 */
export function isMakerPositionId(
  maybePositionId: unknown,
): maybePositionId is IMakerPositionIdData {
  return isPositionId(maybePositionId) && 'vaultId' in maybePositionId
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerPositionIdData = {} as z.infer<typeof MakerPositionIdSchema>
