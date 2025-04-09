import { z } from 'zod'
import { IArmadaManager } from '../../common/interfaces/IArmadaManager'
import { IArmadaPosition, ArmadaPositionDataSchema } from '@summerfi/sdk-common'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaSimulatedPosition
 * @description Interface for an Armada Protocol simulated position, used in the simulator only
 */
export interface IArmadaSimulatedPosition extends IArmadaPosition, IArmadaSimulatedPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Armada Manager used to retrieve information for the simulation */
  readonly armadaManager: IArmadaManager
}

/**
 * @description Zod schema for IArmadaSimulatedPosition
 */
export const ArmadaSimulatedPositionDataSchema = z.object({
  ...ArmadaPositionDataSchema.shape,
  armadaManager: z.custom<IArmadaManager>((val) => val !== undefined),
})

/**
 * Type for the data part of IArmadaSimulatedPosition
 */
export type IArmadaSimulatedPositionData = Readonly<
  z.infer<typeof ArmadaSimulatedPositionDataSchema>
>

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
