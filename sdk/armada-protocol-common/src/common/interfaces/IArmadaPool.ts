import { IPool, PoolDataSchema, PoolType } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaVaultId, isArmadaVaultId } from './IArmadaVaultId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaPool
 * @description Interface for an ID of an Armada Protocol pool (fleet)
 */
export interface IArmadaPool extends IPool, IArmadaPoolData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** ID of the pool */
  readonly id: IArmadaVaultId

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
}

/**
 * @description Zod schema for IArmadaPool
 */
export const ArmadaPoolDataSchema = z.object({
  ...PoolDataSchema.shape,
  id: z.custom<IArmadaVaultId>((val) => isArmadaVaultId(val)),
  type: z.literal(PoolType.Armada),
})

/**
 * Type for the data part of IArmadaPool
 */
export type IArmadaPoolData = Readonly<z.infer<typeof ArmadaPoolDataSchema>>

/**
 * @description Type guard for IArmadaPool
 * @param maybeArmadaPool Object to be checked
 * @returns true if the object is a IArmadaPool
 */
export function isArmadaPool(maybeArmadaPool: unknown): maybeArmadaPool is IArmadaPool {
  return ArmadaPoolDataSchema.safeParse(maybeArmadaPool).success
}
