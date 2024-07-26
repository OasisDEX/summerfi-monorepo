import { z } from 'zod'
import { IPrintable } from '../../../common'
import { ILendingPool } from '../../../lending-protocols'
import {
  ILendingPosition,
  LendingPositionDataSchema,
} from '../../../lending-protocols/interfaces/ILendingPosition'
import { IExternalLendingPositionId } from './IExternalLendingPositionId'

/**
 * @interface IExternalLendingPosition
 * @description Lending position existing in another service
 */
export interface IExternalLendingPosition extends ILendingPosition, IPrintable {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IExternalLendingPosition'
  /** External position ID */
  id: IExternalLendingPositionId
}

/**
 * @description Zod schema for IExternalLendingPosition
 */
export const ExternalLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: z.custom<IExternalLendingPositionId>(),
  pool: z.custom<ILendingPool>(),
})

/**
 * Type for the data part of the IExternalLendingPosition interface
 */
export type IExternalLendingPositionData = Readonly<
  z.infer<typeof ExternalLendingPositionDataSchema>
>

/**
 * Type for the parameters of the IExternalLendingPosition interface
 */
export type IExternalLendingPositionParameters = Omit<IExternalLendingPositionData, ''>

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
