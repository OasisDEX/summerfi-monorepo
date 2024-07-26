import { IPosition, ITokenAmount, isTokenAmount } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaPositionId, isArmadaPositionId } from './IArmadaPositionId'

/**
 * @interface IArmadaPosition
 * @description Interface for an Armada Protocol position
 */
export interface IArmadaPosition extends IPosition, IArmadaPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IArmadaPosition'
  /** ID of the position */
  readonly id: IArmadaPositionId
  /** Amount deposited in the Fleet */
  readonly amount: ITokenAmount
}

/**
 * @description Zod schema for IArmadaPosition
 */
export const ArmadaPositionDataSchema = z.object({
  id: z.custom<IArmadaPositionId>((val) => isArmadaPositionId(val)),
  amount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
})

/**
 * Type for the data part of IArmadaPosition
 */
export type IArmadaPositionData = Readonly<z.infer<typeof ArmadaPositionDataSchema>>

/**
 * Type for the parameters of the IArmadaPosition interface
 */
export type IArmadaPositionParameters = Omit<IArmadaPositionData, ''>

/**
 * @description Type guard for IArmadaPosition
 * @param maybeArmadaPosition Object to be checked
 * @returns true if the object is a IArmadaPosition
 */
export function isArmadaPosition(
  maybeArmadaPosition: unknown,
): maybeArmadaPosition is IArmadaPosition {
  return ArmadaPositionDataSchema.safeParse(maybeArmadaPosition).success
}
