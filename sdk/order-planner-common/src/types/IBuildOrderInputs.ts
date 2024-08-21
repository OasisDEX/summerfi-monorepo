import {
  IPositionsManager,
  ISimulation,
  IUser,
  PositionsManagerDataSchema,
  SimulationSchema,
  UserDataSchema,
} from '@summerfi/sdk-common'
import { z } from 'zod'

/**
 * @name IBuildOrderInputs
 * @description Inputs to build an order
 */
export interface IBuildOrderInputs extends IBuildOrderInputsData {
  /** User that is requesting the order */
  user: IUser
  /** DPM associated to this order and the one that will execute it, optional */
  positionsManager?: IPositionsManager
  /** Simulation to generate the order */
  simulation: ISimulation
}

/**
 * @description Zod schema for IBuildOrderInputs
 */
export const BuildOrderInputsDataSchema = z.object({
  user: UserDataSchema,
  positionsManager: PositionsManagerDataSchema.or(z.undefined()),
  simulation: SimulationSchema,
})

/**
 * Type for the data part of the IBuildOrderInputs interface
 */
export type IBuildOrderInputsData = Readonly<z.infer<typeof BuildOrderInputsDataSchema>>

/**
 * @description Type guard for IBuildOrderInputs
 * @param maybeBuildOrderInputsData
 * @returns true if the object is an IBuildOrderInputs
 */
export function isBuildOrderInputs(
  maybeBuildOrderInputsData: unknown,
  returnedErrors?: string[],
): maybeBuildOrderInputsData is IBuildOrderInputs {
  const zodReturn = BuildOrderInputsDataSchema.safeParse(maybeBuildOrderInputsData)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
