import { z } from 'zod'
import { PositionType } from '../enums/PositionType'
import { type IPositionId, PositionIdDataSchema } from './IPositionId'
import { isUser, type IUser } from '../../user/interfaces/IUser'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaPositionId
 * @description Interface for an ID of an Armada Protocol position
 */
export interface IArmadaPositionId extends IPositionId, IArmadaPositionIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** User that opened the position, used to identify the position in a Fleet Commander */
  readonly user: IUser

  // Re-declaring the properties to narrow the types
  readonly type: PositionType.Armada
}

/**
 * @description Zod schema for IArmadaPositionId
 */
export const ArmadaPositionIdDataSchema = z.object({
  ...PositionIdDataSchema.shape,
  user: z.custom<IUser>((val) => isUser(val)),
  type: z.literal(PositionType.Armada),
})

/**
 * Type for the data part of IArmadaPositionId
 */
export type IArmadaPositionIdData = Readonly<z.infer<typeof ArmadaPositionIdDataSchema>>

/**
 * @description Type guard for IArmadaPositionId
 * @param maybeArmadaPositionId Object to be checked
 * @returns true if the object is a IArmadaPositionId
 */
export function isArmadaPositionId(
  maybeArmadaPositionId: unknown,
  returnedErrors?: string[],
): maybeArmadaPositionId is IArmadaPositionId {
  const zodReturn = ArmadaPositionIdDataSchema.safeParse(maybeArmadaPositionId)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
