import { z } from 'zod'
import { IArmadaProtocol, isArmadaProtocol } from './IArmadaProtocol'
import { PoolIdDataSchema, type IPoolId } from './IPoolId'
import { isChainInfo, type IChainInfo } from './IChainInfo'
import { isAddress, type IAddress } from './IAddress'
import { PoolType } from '../enums/PoolType'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaVaultId
 * @description Interface for an ID of an Armada Protocol pool (fleet)
 */
export interface IArmadaVaultId extends IPoolId, IArmadaVaultIdData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** Chain where the fleet is deployed */
  readonly chainInfo: IChainInfo
  /** Address of the fleet commander that gives access to the pool */
  readonly fleetAddress: IAddress

  // Re-declaring the properties to narrow the types
  readonly type: PoolType.Armada
  readonly protocol: IArmadaProtocol
}

/**
 * @description Zod schema for IArmadaVaultId
 */
export const ArmadaVaultIdDataSchema = z.object({
  ...PoolIdDataSchema.shape,
  type: z.literal(PoolType.Armada),
  chainInfo: z.custom<IChainInfo>((val) => isChainInfo(val)),
  fleetAddress: z.custom<IAddress>((val) => isAddress(val)),
  protocol: z.custom<IArmadaProtocol>((val) => isArmadaProtocol(val)),
})

/**
 * Type for the data part of IArmadaVaultId
 */
export type IArmadaVaultIdData = Readonly<z.infer<typeof ArmadaVaultIdDataSchema>>

/**
 * @description Type guard for IArmadaVaultId
 * @param maybeArmadaVaultId Object to be checked
 * @returns true if the object is a IMakerLendingPosition
 */
export function isArmadaVaultId(
  maybeArmadaVaultId: unknown,
  returnedErrors?: string[],
): maybeArmadaVaultId is IArmadaVaultId {
  const zodReturn = ArmadaVaultIdDataSchema.safeParse(maybeArmadaVaultId)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(zodReturn.error.message)
  }

  return zodReturn.success
}
