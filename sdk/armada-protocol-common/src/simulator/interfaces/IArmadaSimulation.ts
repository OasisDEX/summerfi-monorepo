import { IArmadaPosition, isArmadaPosition } from '@summerfi/sdk-common'
import { ISimulation, SimulationSchema, SimulationType, IUser, isUser } from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaSimulation
 * @description Simulation result of an Armada Protocol operation
 */
export interface IArmadaSimulation extends ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** User for which the simulation was performed */
  readonly user: IUser
  /** Previous position. If it didn't exist it is initialized to 0 */
  readonly previousPosition: IArmadaPosition
  /** New updated position */
  readonly newPosition: IArmadaPosition

  // Re-declaring the properties to narrow the types
  readonly type: SimulationType.Armada
}

/**
 * @description Zod schema for IArmadaSimulation
 */
export const ArmadaSimulationSchema = z.object({
  ...SimulationSchema.shape,
  user: z.custom<IUser>((val) => isUser(val)),
  previousPosition: z.custom<IArmadaPosition>((val) => isArmadaPosition(val)),
  newPosition: z.custom<IArmadaPosition>((val) => isArmadaPosition(val)),
  type: z.literal(SimulationType.Armada),
})

/**
 * Type for the data part of the IArmadaSimulation interface
 */
export type IArmadaSimulationData = Readonly<z.infer<typeof ArmadaSimulationSchema>>

/**
 * @description Type guard for IRefinanceSimulation
 * @param maybeArmadaSimulationData
 * @returns true if the object is an IArmadaSimulation
 */
export function isArmadaSimulation(
  maybeArmadaSimulationData: unknown,
): maybeArmadaSimulationData is IArmadaSimulation {
  return ArmadaSimulationSchema.safeParse(maybeArmadaSimulationData).success
}
