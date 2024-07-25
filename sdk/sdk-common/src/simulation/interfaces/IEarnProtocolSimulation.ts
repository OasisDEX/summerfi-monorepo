import { z } from 'zod'
import { SimulationType } from '../enums/SimulationType'
import { ISimulation, SimulationSchema } from './ISimulation'

/**
 * @interface IEarnProtocolSimulation
 * @description Simulation result of an Earn Protocol operation
 */
export interface IEarnProtocolSimulation extends ISimulation {
  /** Type of the simulation, in this case Earn Protocol */
  readonly type: SimulationType.EarnProtocol
}

/**
 * @description Zod schema for IEarnProtocolSimulation
 */
export const EarnProtocolSimulationSchema = z.object({
  ...SimulationSchema.shape,
  type: z.literal(SimulationType.EarnProtocol),
})

/**
 * Type for the data part of the IEarnProtocolSimulation interface
 */
export type IEarnProtocolSimulationData = Readonly<z.infer<typeof EarnProtocolSimulationSchema>>

/**
 * @description Type guard for IRefinanceSimulation
 * @param maybeEarnProtocolSimulationData
 * @returns true if the object is an IEarnProtocolSimulation
 */
export function isEarnProtocolSimulation(
  maybeEarnProtocolSimulationData: unknown,
): maybeEarnProtocolSimulationData is IEarnProtocolSimulation {
  return EarnProtocolSimulationSchema.safeParse(maybeEarnProtocolSimulationData).success
}
