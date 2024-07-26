import { PositionType } from '@summerfi/sdk-common/common'
import {
  ILendingPositionId,
  LendingPositionIdDataSchema,
} from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { MakerVaultId, MakerVaultIdSchema } from '../types/MakerVaultId'
/**
 * @interface IMakerLendingPositionId
 * @description Identifier of a Maker lending position
 */
export interface IMakerLendingPositionId extends ILendingPositionId, IMakerLendingPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IMakerLendingPositionId'
  /** The vault ID that identifies the position on Maker */
  readonly vaultId: MakerVaultId

  // Re-declaring the properties with the correct types
  readonly type: PositionType
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
 * Type for the parameters of the IMakerLendingPositionId interface
 */
export type IMakerLendingPositionIdParameters = Omit<IMakerLendingPositionIdData, 'type'>

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
