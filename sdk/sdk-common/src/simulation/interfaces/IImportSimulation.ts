import { z } from 'zod'
import {
  ILendingPosition,
  isLendingPosition,
} from '../../lending-protocols/interfaces/ILendingPosition'
import {
  IExternalLendingPosition,
  isExternalLendingPosition,
} from '../../orders/importing/interfaces/IExternalLendingPosition'
import { SimulationType } from '../enums/SimulationType'
import { ISimulation, SimulationSchema } from './ISimulation'
import { Steps } from './Steps'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __iimportsimulation__: unique symbol = Symbol()

/**
 * @interface IImportSimulation
 * @description Simulation result of an import operation
 */
export interface IImportSimulation extends ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__iimportsimulation__]: 'IImportSimulation'
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
  sourcePosition: z.custom<IExternalLendingPosition>((val) => isExternalLendingPosition(val)),
  targetPosition: z.custom<ILendingPosition>((val) => isLendingPosition(val)),
  steps: z.array(z.custom<Steps>()),
})

/**
 * Type for the data part of the IImportSimulation interface
 */
export type IImportSimulationData = Readonly<z.infer<typeof ImportSimulationSchema>>

/**
 * Type for the parameters of the IImportSimulation interface
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
