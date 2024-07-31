import { z } from 'zod'
import { PositionDataSchema } from '../../common/interfaces/IPosition'
import { ILendingPosition } from '../../lending-protocols/interfaces/ILendingPosition'
import { IExternalLendingPosition } from '../../orders/importing/interfaces/IExternalLendingPosition'
import { SimulationType } from '../enums/SimulationType'
import { ISimulation, SimulationSchema } from './ISimulation'
import { Steps } from './Steps'

/**
 * @interface IImportSimulation
 * @description Simulation result of an import operation
 */
export interface IImportSimulation extends ISimulation {
  /** Type of the simulation, in this case Import */
  readonly type: SimulationType.ImportPosition
  /** Original position that will be refinanced */
  readonly sourcePosition: IExternalLendingPosition
  /** Simulated target position */
  readonly targetPosition: ILendingPosition
  /** Steps needed to perform the refinance */
  readonly steps: Steps[]
}

/**
 * @description Zod schema for IImportSimulation
 */
export const ImportSimulationSchema = z.object({
  ...SimulationSchema.shape,
  type: z.literal(SimulationType.ImportPosition),
  sourcePosition: PositionDataSchema,
  targetPosition: PositionDataSchema,
})

/**
 * Type for the data part of the IImportSimulation interface
 */
export type IImportSimulationData = Readonly<z.infer<typeof ImportSimulationSchema>>

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
