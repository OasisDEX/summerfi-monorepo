import { IPool, PoolDataSchema, PoolType } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaPoolId, isArmadaPoolId } from './IArmadaPoolId'

/**
 * @interface IArmadaPool
 * @description Interface for an ID of an Armada Protocol pool (fleet)
 */
export interface IArmadaPool extends IPool, IArmadaPoolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly _signature_1: 'IArmadaPool'
  /** ID of the pool */
  readonly id: IArmadaPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType
}

/**
 * @description Zod schema for IArmadaPool
 */
export const ArmadaPoolDataSchema = z.object({
  ...PoolDataSchema.shape,
  id: z.custom<IArmadaPoolId>((val) => isArmadaPoolId(val)),
})

/**
 * Type for the data part of IArmadaPool
 */
export type IArmadaPoolData = Readonly<z.infer<typeof ArmadaPoolDataSchema>>

/**
 * Type for the parameters of the IArmadaPool interface
 */
export type IArmadaPoolParameters = Omit<IArmadaPoolData, 'type'>

/**
 * @description Type guard for IArmadaPool
 * @param maybeArmadaPool Object to be checked
 * @returns true if the object is a IArmadaPool
 */
export function isArmadaPool(maybeArmadaPool: unknown): maybeArmadaPool is IArmadaPool {
  return ArmadaPoolDataSchema.safeParse(maybeArmadaPool).success
}
