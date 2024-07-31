import { z } from 'zod'
import { IPrintable } from '../../../common'
import {
  ILendingPosition,
  LendingPositionDataSchema,
} from '../../../lending-protocols/interfaces/ILendingPosition'
import { IExternalLendingPositionId } from './IExternalLendingPositionId'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __iexternallendingposition__: unique symbol = Symbol()

/**
 * @interface IExternalLendingPosition
 * @description Lending position existing in another service
 */
export interface IExternalLendingPosition extends ILendingPosition, IPrintable {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__iexternallendingposition__]: 'IExternalLendingPosition'
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
