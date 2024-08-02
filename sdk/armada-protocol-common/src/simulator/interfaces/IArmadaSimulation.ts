import { ISimulation, SimulationSchema, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'
import { IArmadaPosition, isArmadaPosition } from '../../common/interfaces/IArmadaPosition'

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
  /** Already existing position, in case it existed */
  readonly previousPosition?: IArmadaPosition
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
  previousPosition: z.custom<IArmadaPosition | undefined>(
    (val) => val === undefined || isArmadaPosition(val),
  ),
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
