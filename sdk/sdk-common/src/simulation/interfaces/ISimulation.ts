import { z } from 'zod'
import { SimulationType } from '../enums/SimulationType'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __isimulation__: unique symbol = Symbol()

/**
 * @interface ISimulation
 * @description Generic simulation interface, defines the simulation type for all simulations
 */
export interface ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__isimulation__]: 'ISimulation'
  /** The type of the simulation */
  readonly type: SimulationType
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
