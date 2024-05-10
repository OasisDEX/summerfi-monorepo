import { AddressSchema, IAddressData } from '../../common/interfaces/IAddress'
import { Address } from '../../common/implementation/Address'
import { z } from 'zod'

/**
 * @name IPositionsManager
 * @description Interface for the positions manager (DPM)
 *
 * The Positions Manager is the proxy used to interact with the Summer.fi system. It is used as Smart Account for the user.
 */
export interface IPositionsManagerData {
  readonly address: IAddressData
}

/**
 * @name IPositionsManager
 * @description Interface for the positions manager (DPM)
 */
export interface IPositionsManager extends IPositionsManagerData {
  /** Address of the Positions Manager */
  readonly address: Address
}

/**
 * @description Zod schema for IPositionsManager
 */
export const PositionsManagerSchema = z.object({
  address: AddressSchema,
})

/**
 * @description Type guard for IPositionsManager
 * @param maybePositionsManager
 * @returns true if the object is an IPositionsManager
 */
export function isPositionsManager(
  maybePositionsManager: unknown,
): maybePositionsManager is IPositionsManagerData {
  return PositionsManagerSchema.safeParse(maybePositionsManager).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPositionsManagerData = {} as z.infer<typeof PositionsManagerSchema>
