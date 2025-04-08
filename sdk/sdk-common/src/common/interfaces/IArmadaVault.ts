import { z } from 'zod'
import { IArmadaVaultId, isArmadaVaultId } from './IArmadaVaultId'
import { type IPool, PoolDataSchema } from './IPool'
import { PoolType } from '../enums/PoolType'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaVault
 * @description Interface for an ID of an Armada Protocol vault (fleet)
 */
export interface IArmadaVault extends IPool, IArmadaVaultData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** ID of the vault */
  readonly id: IArmadaVaultId

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
}

/**
 * @description Zod schema for IArmadaVault
 */
export const ArmadaVaultDataSchema = z.object({
  ...PoolDataSchema.shape,
  id: z.custom<IArmadaVaultId>((val) => isArmadaVaultId(val)),
  type: z.literal(PoolType.Armada),
})

/**
 * Type for the data part of IArmadaVault
 */
export type IArmadaVaultData = Readonly<z.infer<typeof ArmadaVaultDataSchema>>

/**
 * @description Type guard for IArmadaVault
 * @param maybeArmadaVault Object to be checked
 * @returns true if the object is a IArmadaVault
 */
export function isArmadaVault(maybeArmadaVault: unknown): maybeArmadaVault is IArmadaVault {
  return ArmadaVaultDataSchema.safeParse(maybeArmadaVault).success
}
