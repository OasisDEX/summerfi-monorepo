import { z } from 'zod'
import { IPrintable, PositionType } from '../../../common'
import { IAddress } from '../../../common/interfaces/IAddress'
import {
  ILendingPositionId,
  LendingPositionIdDataSchema,
} from '../../../lending-protocols/interfaces/ILendingPositionId'
import {
  ExternalLendingPositionType,
  ExternalLendingPositionTypeSchema,
} from '../enums/ExrternalLendingPositionType'

/**
 * @interface IExternalPositionId
 * @description Identifier for an external position to the Summer system
 */
export interface IExternalLendingPositionId
  extends IExternalLendingPositionIdData,
    ILendingPositionId,
    IPrintable {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IExternalLendingPositionId'
  /** Type of the position */
  readonly externalType: ExternalLendingPositionType
  /** Address of the owner of the position */
  readonly address: IAddress
  /** ID of the lending protocol */
  readonly protocolId: ILendingPositionId

  // Re-declare the narrowed type
  readonly type: PositionType
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
 * Type for the parameters of the IExternalPositionId interface
 */
export type IExternalLendingPositionIdParameters = Omit<IExternalLendingPositionIdData, 'type'>

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
