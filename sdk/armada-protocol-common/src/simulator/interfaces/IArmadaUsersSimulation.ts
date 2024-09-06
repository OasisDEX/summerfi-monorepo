import { ISimulation, SimulationSchema, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'
import { IArmadaPosition, isArmadaPosition } from '../../common/interfaces/IArmadaPosition'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaUsersSimulation
 * @description Simulation result of an Armada Protocol Users operation
 */
export interface IArmadaUsersSimulation extends ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** User for which the simulation was performed */
  readonly user: IUser
  /** Previous position. If it didn't exist it is initialized to 0 */
  readonly previousPosition: IArmadaPosition
  /** New updated position */
  readonly newPosition: IArmadaPosition

  // Re-declaring the properties to narrow the types
  readonly type: SimulationType.ArmadaUsers
}

/**
 * @description Zod schema for IArmadaSimulation
 */
export const ArmadaUsersSimulationSchema = z.object({
  ...SimulationSchema.shape,
  user: z.custom<IUser>((val) => isUser(val)),
  previousPosition: z.custom<IArmadaPosition>((val) => isArmadaPosition(val)),
  newPosition: z.custom<IArmadaPosition>((val) => isArmadaPosition(val)),
  type: z.literal(SimulationType.ArmadaUsers),
})

/**
 * Type for the data part of the IArmadaSimulation interface
 */
export type IArmadaUsersSimulationData = Readonly<z.infer<typeof ArmadaUsersSimulationSchema>>

/**
 * @description Type guard for IArmadaUsersSimulation
 * @param maybeArmadaUsersSimulationData
 * @returns true if the object is an IArmadaUsersSimulation
 */
export function isArmadaUsersSimulation(
  maybeArmadaUsersSimulationData: unknown,
): maybeArmadaUsersSimulationData is IArmadaUsersSimulation {
  return ArmadaUsersSimulationSchema.safeParse(maybeArmadaUsersSimulationData).success
}
