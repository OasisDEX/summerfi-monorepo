import { z } from 'zod'
import { ArmadaPositionDataSchema, IArmadaPosition } from '../../common/interfaces/IArmadaPosition'

/**
 * @interface IArmadaSimulatedPosition
 * @description Interface for an Armada Protocol simulated position, used in the simulator only
 */
export interface IArmadaSimulatedPosition extends IArmadaPosition, IArmadaSimulatedPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_2: 'IArmadaSimulatedPosition'
}

/**
 * @description Zod schema for IArmadaSimulatedPosition
 */
export const ArmadaSimulatedPositionDataSchema = z.object({
  ...ArmadaPositionDataSchema.shape,
})

/**
 * Type for the data part of IArmadaSimulatedPosition
 */
export type IArmadaSimulatedPositionData = Readonly<
  z.infer<typeof ArmadaSimulatedPositionDataSchema>
>

/**
 * Type for the parameters of the IArmadaSimulatedPosition interface
 */
export type IArmadaSimulatedPositionParameters = Omit<IArmadaSimulatedPositionData, ''>

/**
 * @description Type guard for IArmadaSimulatedPosition
 * @param maybeArmadaSimulatedPosition Object to be checked
 * @returns true if the object is a IArmadaSimulatedPosition
 */
export function isArmadaSimulatedPosition(
  maybeArmadaSimulatedPosition: unknown,
): maybeArmadaSimulatedPosition is IArmadaSimulatedPosition {
  return ArmadaPositionDataSchema.safeParse(maybeArmadaSimulatedPosition).success
}
