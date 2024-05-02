import { z } from 'zod'

/**
 * @name MakerVaultId
 * @description Represents a Maker vault ID
 */
export type MakerVaultId = string

/**
 * @description Zod schema for MakerVaultId
 */
export const MakerVaultIdSchema = z.string()

/**
 * @description Type guard for MakerVaultId
 * @param maybeMakerVaultId Object to be checked
 * @returns true if the object is a MakerVaultId
 */
export function isMakerVaultId(maybeMakerVaultId: unknown): maybeMakerVaultId is MakerVaultId {
  return MakerVaultIdSchema.safeParse(maybeMakerVaultId).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: MakerVaultId = {} as z.infer<typeof MakerVaultIdSchema>
