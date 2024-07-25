import { z } from 'zod'
import { IPrintable } from '../../../common'
import { LendingPoolDataSchema } from '../../../lending-protocols'
import {
  ILendingPosition,
  LendingPositionDataSchema,
} from '../../../lending-protocols/interfaces/ILendingPosition'
import {
  ExternalLendingPositionIdDataSchema,
  IExternalLendingPositionId,
} from './IExternalLendingPositionId'

/**
 * @interface IExternalLendingPosition
 * @description Lending position existing in another service
 */
export interface IExternalLendingPosition extends ILendingPosition, IPrintable {
  /** External position ID */
  id: IExternalLendingPositionId
}

/**
 * @description Zod schema for IExternalLendingPosition
 */
export const ExternalLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: ExternalLendingPositionIdDataSchema,
  pool: LendingPoolDataSchema,
})

/**
 * Type for the data part of the IExternalLendingPosition interface
 */
export type IExternalLendingPositionData = Readonly<
  z.infer<typeof ExternalLendingPositionDataSchema>
>

/**
 * @description Type guard for IExternalLendingPosition
 * @param maybeExternalLendingPosition
 * @returns true if the object is an IExternalLendingPosition
 */
export function isExternalLendingPosition(
  maybeExternalLendingPosition: unknown,
): maybeExternalLendingPosition is IExternalLendingPosition {
  return ExternalLendingPositionDataSchema.safeParse(maybeExternalLendingPosition).success
}
