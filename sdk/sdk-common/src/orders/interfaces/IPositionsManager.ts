import { AddressDataSchema } from '../../common/interfaces/IAddress'
import { Address } from '../../common/implementation/Address'
import { z } from 'zod'

/**
 * @name IPositionsManager
 * @description Interface for the positions manager (DPM)
 *
 * The Positions Manager is the proxy used to interact with the Summer.fi system. It is used as Smart Account for the user.
 */
export interface IPositionsManager extends IPositionsManagerData {
  /** Address of the Positions Manager */
  readonly address: Address
}

/**
 * @description Zod schema for IPositionsManager
 */
export const PositionsManagerDataSchema = z.object({
  address: AddressDataSchema,
})

/**
 * Type for the data part of the IPositionsManager interface
 */
export type IPositionsManagerData = Readonly<z.infer<typeof PositionsManagerDataSchema>>

/**
 * @description Type guard for IPositionsManager
 * @param maybePositionsManager
 * @returns true if the object is an IPositionsManager
 */
export function isPositionsManager(
  maybePositionsManager: unknown,
): maybePositionsManager is IPositionsManager {
  return PositionsManagerDataSchema.safeParse(maybePositionsManager).success
}
