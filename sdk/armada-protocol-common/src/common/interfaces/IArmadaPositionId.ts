import { IPositionId, PositionIdDataSchema, PositionType } from '@summerfi/sdk-common/common'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'

/**
 * @interface IArmadaPositionId
 * @description Interface for an ID of an Armada Protocol position
 */
export interface IArmadaPositionId extends IPositionId, IArmadaPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IArmadaPositionId'
  /** User that opened the position, used to identify the position in a Fleet Commander */
  readonly user: IUser

  // Re-declaring the properties with the correct types
  readonly type: PositionType
}

/**
 * @description Zod schema for IArmadaPositionId
 */
export const ArmadaPositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
  user: z.custom<IUser>((val) => isUser(val)),
})

/**
 * Type for the data part of IArmadaPositionId
 */
export type IArmadaPositionIdData = Readonly<z.infer<typeof ArmadaPositionIdDataSchema>>

/**
 * Type for the parameters of the IArmadaPositionId interface
 */
export type IArmadaPositionIdParameters = Omit<IArmadaPositionIdData, 'type'>

/**
 * @description Type guard for IArmadaPositionId
 * @param maybeArmadaPositionId Object to be checked
 * @returns true if the object is a IArmadaPositionId
 */
export function isArmadaPositionId(
  maybeArmadaPositionId: unknown,
): maybeArmadaPositionId is IArmadaPositionId {
  return ArmadaPositionIdDataSchema.safeParse(maybeArmadaPositionId).success
}
