import { isExternalLendingPosition } from '@summerfi/sdk-common'
import { ILendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { IExternalLendingPosition } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationSchema } from '@summerfi/sdk-common/simulation'
import { z } from 'zod'
import { DMASimulatorSteps } from '../implementation/DMASimulatorSteps'

/**
 * @interface IImportSimulation
 * @description Simulation result of an import operation
 */
export interface IImportSimulation extends ISimulation {
  /** Original position that will be refinanced */
  readonly sourcePosition: IExternalLendingPosition
  /** Simulated target position */
  readonly targetPosition: ILendingPosition
  /** Steps needed to perform the refinance */
  readonly steps: DMASimulatorSteps[]
}

/**
 * @description Zod schema for IImportSimulation
 */
export const ImportSimulationSchema = z.object({
  ...SimulationSchema.shape,
  sourcePosition: z.custom<IExternalLendingPosition>((val) => isExternalLendingPosition(val)),
  targetPosition: z.custom<ILendingPosition>((val) => isExternalLendingPosition(val)),
  steps: z.array(z.custom<DMASimulatorSteps>()), // TODO: missing validation here
})

/**
 * Type for the data part of the IImportSimulation interface
 */
export type IImportSimulationData = Readonly<z.infer<typeof ImportSimulationSchema>>

/**
 * Type for the parameters needed to create an IImportSimulation
 */
export type IImportSimulationParameters = Omit<IImportSimulationData, 'type'>

/**
 * @description Type guard for IRefinanceSimulation
 * @param maybeImportSimulationData
 * @returns true if the object is an IImportSimulation
 */
export function isImportSimulation(
  maybeImportSimulationData: unknown,
): maybeImportSimulationData is IImportSimulation {
  return ImportSimulationSchema.safeParse(maybeImportSimulationData).success
}
