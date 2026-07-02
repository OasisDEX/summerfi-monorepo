import { z } from 'zod'
import { SimulationType } from '../enums/SimulationType'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Generic simulation interface, defines the simulation type for all simulations
 */
export interface ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The type of the simulation */
  readonly type: SimulationType
}

/**
 * Zod schema for ISimulation
 */
export const SimulationSchema = z.object({
  type: z.nativeEnum(SimulationType),
})

/**
 * Type for the data part of the IToken interface
 */
export type ISimulationData = Readonly<z.infer<typeof SimulationSchema>>

/**
 * Type guard for ISimulation
 *
 * @param maybeSimulationData
 * @returns true if the object is an IToken
 */
export function isSimulation(maybeSimulationData: unknown): maybeSimulationData is ISimulation {
  return SimulationSchema.safeParse(maybeSimulationData).success
}
