import { z } from 'zod'
import { SimulationType } from '../enums/SimulationType'

/**
 * @interface ISimulation
 * @description Generic simulation interface, defines the simulation type for all simulations
 */
export interface ISimulation {
  /** The type of the simulation */
  type: SimulationType
}

/**
 * @description Zod schema for ISimulation
 */
export const SimulationSchema = z.object({
  type: z.nativeEnum(SimulationType),
})

/**
 * Type for the data part of the IToken interface
 */
export type ISimulationData = Readonly<z.infer<typeof SimulationSchema>>

/**
 * @description Type guard for ISimulation
 * @param maybeSimulationData
 * @returns true if the object is an IToken
 */
export function isSimulation(maybeSimulationData: unknown): maybeSimulationData is ISimulation {
  return SimulationSchema.safeParse(maybeSimulationData).success
}
