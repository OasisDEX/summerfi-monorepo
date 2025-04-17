import { z } from 'zod'
import { IPrintable } from '../../../common/interfaces/IPrintable'
import {
  ILendingPosition,
  LendingPositionDataSchema,
} from '../../../lending-protocols/interfaces/ILendingPosition'
import { IExternalLendingPositionId } from './IExternalLendingPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IExternalLendingPosition
 * @description Lending position existing in another service
 */
export interface IExternalLendingPosition extends ILendingPosition, IPrintable {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** External position ID */
  readonly id: IExternalLendingPositionId
}

/**
 * @description Zod schema for IExternalLendingPosition
 */
export const ExternalLendingPositionDataSchema = z.object({
  ...LendingPositionDataSchema.shape,
  id: z.custom<IExternalLendingPositionId>(),
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
