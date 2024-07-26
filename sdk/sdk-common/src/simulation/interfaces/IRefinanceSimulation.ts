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
 * @interface IRefinanceSimulation
 * @description Simulation result of a refinance operation
 */
export interface IRefinanceSimulation extends ISimulation {
  /** Type of the simulation, in this case Refinance */
  readonly type: SimulationType.Refinance
  /** Original position that will be refinanced */
  readonly sourcePosition: ILendingPosition
  /** Simulated target position */
  readonly targetPosition: ILendingPosition
  /** The details of any swaps required as part of the simulation */
  readonly swaps: SimulatedSwapData[]
  /** Steps needed to perform the refinance */
  readonly steps: Steps[]
}

/**
 * @description Zod schema for IRefinanceSimulation
 */
export const RefinanceSimulationSchema = z.object({
  ...SimulationSchema.shape,
  type: z.literal(SimulationType.Refinance),
  sourcePosition: z.custom<ILendingPosition>((val) => isLendingPosition(val)),
  targetPosition: z.custom<ILendingPosition>((val) => isLendingPosition(val)),
})

/**
 * Type for the data part of the IRefinanceSimulation interface
 */
export type IRefinanceSimulationData = Readonly<z.infer<typeof RefinanceSimulationSchema>>

/**
 * @description Type guard for IRefinanceSimulation
 * @param maybeRefinanceSimulationData
 * @returns true if the object is an IRefinanceSimulation
 */
export function isRefinanceSimulation(
  maybeRefinanceSimulationData: unknown,
): maybeRefinanceSimulationData is IRefinanceSimulation {
  console.log(maybeRefinanceSimulationData)
  const success = RefinanceSimulationSchema.safeParse(maybeRefinanceSimulationData).success
  console.log(success)
  if (!success) {
    RefinanceSimulationSchema.parse(maybeRefinanceSimulationData)
  }
  return success
}
