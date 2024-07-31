import { z } from 'zod'

import { IAddress } from '../../../common/interfaces/IAddress'
import { IPrintable } from '../../../common/interfaces/IPrintable'
import {
  ILendingPositionId,
  LendingPositionIdDataSchema,
} from '../../../lending-protocols/interfaces/ILendingPositionId'
import {
  ExternalLendingPositionType,
  ExternalLendingPositionTypeSchema,
} from '../enums/ExrternalLendingPositionType'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IExternalPositionId
 * @description Identifier for an external position to the Summer system
 */
export interface IExternalLendingPositionId
  extends IExternalLendingPositionIdData,
    ILendingPositionId,
    IPrintable {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Type of the position */
  readonly externalType: ExternalLendingPositionType
  /** Address of the owner of the position */
  readonly address: IAddress
  /** ID of the lending protocol */
  readonly protocolId: ILendingPositionId
}

/**
 * @description Zod schema for IExternalPositionId
 */
export const ExternalLendingPositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
  externalType: ExternalLendingPositionTypeSchema,
  address: z.custom<IAddress>(),
  protocolId: z.custom<ILendingPositionId>(),
})

/**
 * Type for the data part of the IExternalPositionId interface
 */
export type IExternalLendingPositionIdData = Readonly<
  z.infer<typeof ExternalLendingPositionIdDataSchema>
>

/**
 * @description Type guard for IExternalPositionId
 * @param maybeExternalPositionId
 * @returns true if the object is an IExternalPositionId
 */
export function isExternalLendingPositionId(
  maybeExternalPositionId: unknown,
): maybeExternalPositionId is IExternalLendingPositionId {
  return ExternalLendingPositionIdDataSchema.safeParse(maybeExternalPositionId).success
}
