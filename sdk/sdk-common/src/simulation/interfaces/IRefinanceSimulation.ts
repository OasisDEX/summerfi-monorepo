import { z } from 'zod'
import {
  ILendingPosition,
  isLendingPosition,
} from '../../lending-protocols/interfaces/ILendingPosition'
import { SimulatedSwapData } from '../../swap/implementation/SimulatedSwapData'
import { SimulationType } from '../enums/SimulationType'
import { ISimulation, SimulationSchema } from './ISimulation'
import { Steps } from './Steps'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IRefinanceSimulation
 * @description Simulation result of a refinance operation
 */
export interface IRefinanceSimulation extends ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Original position that will be refinanced */
  readonly sourcePosition: ILendingPosition
  /** Simulated target position */
  readonly targetPosition: ILendingPosition
  /** The details of any swaps required as part of the simulation */
  readonly swaps: SimulatedSwapData[]
  /** Steps needed to perform the refinance */
  readonly steps: Steps[]

  // Re-declaring the properties with the correct types
  readonly type: SimulationType
}

/**
 * @description Zod schema for IRefinanceSimulation
 */
export const RefinanceSimulationSchema = z.object({
  ...SimulationSchema.shape,
  type: z.literal(SimulationType.Refinance),
  sourcePosition: z.custom<ILendingPosition>((val) => isLendingPosition(val)),
  targetPosition: z.custom<ILendingPosition>((val) => isLendingPosition(val)),
  swaps: z.array(z.custom<SimulatedSwapData>()),
  steps: z.array(z.custom<Steps>()),
})

/**
 * Type for the data part of the IRefinanceSimulation interface
 */
export type IRefinanceSimulationData = Readonly<z.infer<typeof RefinanceSimulationSchema>>

/**
 * Type for the parameters of the IRefinanceSimulation interface
 */
export type IRefinanceSimulationParameters = Omit<IRefinanceSimulationData, 'type'>

/**
 * @description Type guard for IRefinanceSimulation
 * @param maybeRefinanceSimulationData
 * @returns true if the object is an IRefinanceSimulation
 */
export function isRefinanceSimulation(
  maybeRefinanceSimulationData: unknown,
): maybeRefinanceSimulationData is IRefinanceSimulation {
  return RefinanceSimulationSchema.safeParse(maybeRefinanceSimulationData).success
}
