import { ISimulation, SimulationSchema, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'
import { IArmadaPosition, isArmadaPosition } from '../../common/interfaces/IArmadaPosition'

/**
 * @interface IArmadaSimulation
 * @description Simulation result of an Armada Protocol operation
 */
export interface IArmadaSimulation extends ISimulation {
  /** User for which the simulation was performed */
  readonly user: IUser
  /** Already existing position, in case it existed */
  readonly previousPosition?: IArmadaPosition
  /** New updated position */
  readonly newPosition: IArmadaPosition

  // Re-declaring the properties with the correct types
  readonly type: SimulationType
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
})

/**
 * Type for the data part of the IArmadaSimulation interface
 */
export type IArmadaSimulationData = Readonly<z.infer<typeof ArmadaSimulationSchema>>

/**
 * Type for the parameters of the IArmadaSimulation interface
 */
export type IArmadaSimulationParameters = Omit<IArmadaSimulationData, 'type'>

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
