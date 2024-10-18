import { ISimulation, SimulationSchema, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser, isUser } from '@summerfi/sdk-common/user'
import { z } from 'zod'
import { IArmadaPoolId, isArmadaPoolId } from '../../common'
import {
  IArmadaRebalanceData,
  isArmadaRebalanceData,
} from '../../common/interfaces/IArmadaRebalanceData'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaKeepersSimulation
 * @description Simulation result of an Armada Protocol Keepers operation
 */
export interface IArmadaKeepersSimulation extends ISimulation {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** User for which the simulation was performed */
  readonly keeper: IUser
  /** ID of the pool where the operation is taking place */
  readonly poolId: IArmadaPoolId
  /** Rebalance data */
  readonly rebalanceData: IArmadaRebalanceData[]

  // Re-declaring the properties to narrow the types
  readonly type: SimulationType.ArmadaUsers
}

/**
 * @description Zod schema for IArmadaKeepersSimulation
 */
export const ArmadaKeepersSimulationSchema = z.object({
  ...SimulationSchema.shape,
  keeper: z.custom<IUser>((val) => isUser(val)),
  poolId: z.custom<IArmadaPoolId>((val) => isArmadaPoolId(val)),
  rebalanceData: z.custom<IArmadaRebalanceData[]>((val) =>
    (val as unknown[]).every((val) => isArmadaRebalanceData(val)),
  ),
  type: z.literal(SimulationType.ArmadaUsers),
})

/**
 * Type for the data part of the IArmadaKeepersSimulation interface
 */
export type IArmadaKeepersSimulationData = Readonly<z.infer<typeof ArmadaKeepersSimulationSchema>>

/**
 * @description Type guard for IArmadaKeepersSimulation
 * @param maybeArmadaKeepersSimulationData
 * @returns true if the object is an IArmadaKeepersSimulation
 */
export function isArmadaKeepersSimulation(
  maybeArmadaKeepersSimulationData: unknown,
): maybeArmadaKeepersSimulationData is IArmadaKeepersSimulation {
  return ArmadaKeepersSimulationSchema.safeParse(maybeArmadaKeepersSimulationData).success
}
