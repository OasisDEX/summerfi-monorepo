import { ILendingPosition, isLendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { ISimulation, SimulationSchema, SimulationType } from '@summerfi/sdk-common/simulation'
import { SimulatedSwapData } from '@summerfi/sdk-common/swap'
import { z } from 'zod'
import { DMASimulatorSteps } from '../implementation/DMASimulatorSteps'

/**
 * @interface IRefinanceSimulation
 * @description Simulation result of a refinance operation
 */
export interface IRefinanceSimulation extends ISimulation {
  /** Original position that will be refinanced */
  readonly sourcePosition: ILendingPosition
  /** Simulated target position */
  readonly targetPosition: ILendingPosition
  /** The details of any swaps required as part of the simulation */
  readonly swaps: SimulatedSwapData[]
  /** Steps needed to perform the refinance */
  readonly steps: DMASimulatorSteps[]

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
  swaps: z.array(z.custom<SimulatedSwapData>()), // TODO: missing validation here
  steps: z.array(z.custom<DMASimulatorSteps>()), // TODO: missing validation here
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
