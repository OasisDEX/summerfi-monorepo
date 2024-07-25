import { z } from 'zod'
import { IPrintable, PositionType } from '../../../common'
import { AddressDataSchema, IAddress } from '../../../common/interfaces/IAddress'
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
  /** Type of the position */
  readonly externalType: ExternalLendingPositionType
  /** Address of the owner of the position */
  readonly address: IAddress

  // Re-declare the narrowed type
  readonly type: PositionType.Lending
}

/**
 * @description Zod schema for IExternalPositionId
 */
export const ExternalLendingPositionIdDataSchema = z.object({
  ...LendingPositionIdDataSchema.shape,
  externalType: ExternalLendingPositionTypeSchema,
  address: AddressDataSchema,
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
