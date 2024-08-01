import { IAddress, isAddress } from '@summerfi/sdk-common'
import { IPoolId, PoolIdDataSchema, PoolType } from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaProtocol, isArmadaProtocol } from './IArmadaProtocol'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaPoolId
 * @description Interface for an ID of an Armada Protocol pool (fleet)
 */
export interface IArmadaPoolId extends IPoolId, IArmadaPoolIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Address of the fleet commander that gives access to the pool */
  readonly fleet: IAddress

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
  readonly protocol: IArmadaProtocol
}

/**
 * @description Zod schema for IArmadaPoolId
 */
export const ArmadaPoolIdDataSchema = z.object({
  ...PoolIdDataSchema.shape,
  type: z.literal(PoolType.Armada),
  fleet: z.custom<IAddress>((val) => isAddress(val)),
  protocol: z.custom<IArmadaProtocol>((val) => isArmadaProtocol(val)),
})

/**
 * Type for the data part of IArmadaPoolId
 */
export type IArmadaPoolIdData = Readonly<z.infer<typeof ArmadaPoolIdDataSchema>>

/**
 * @description Type guard for IArmadaPoolId
 * @param maybeArmadaPoolId Object to be checked
 * @returns true if the object is a IMakerLendingPosition
 */
export function isArmadaPoolId(maybeArmadaPoolId: unknown): maybeArmadaPoolId is IArmadaPoolId {
  return ArmadaPoolIdDataSchema.safeParse(maybeArmadaPoolId).success
}
