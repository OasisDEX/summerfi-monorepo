import { IPositionId } from '@summerfi/sdk-common/common'
import { MakerVaultId, MakerVaultIdSchema } from '../types/MakerVaultId'
import { PositionIdSchema, isPositionId } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @interface IMakerPositionId
 * @description Identifier of a Maker position
 */
export interface IMakerPositionId extends IPositionId {
  /** The vault ID that identifies the position on Maker */
  vaultId: MakerVaultId
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
export function isMakerPositionId(maybePositionId: unknown): maybePositionId is IMakerPositionId {
  return isPositionId(maybePositionId) && 'vaultId' in maybePositionId
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IMakerPositionId = {} as z.infer<typeof MakerPositionIdSchema>
