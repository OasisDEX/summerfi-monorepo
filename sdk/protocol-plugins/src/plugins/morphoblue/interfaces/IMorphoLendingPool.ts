import {
  ILendingPool,
  IRiskRatio,
  isAddress,
  isRiskRatio,
  IAddress,
  LendingPoolDataSchema,
} from '@summerfi/sdk-common'
import { z } from 'zod'
import { IMorphoLendingPoolId, isMorphoLendingPoolId } from './IMorphoLendingPoolId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IMorphoLendingPool
 * @description Represents a lending pool in the Morpho protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface IMorphoLendingPool extends IMorphoLendingPoolData, ILendingPool {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** The id of the lending pool */
  readonly id: IMorphoLendingPoolId
  /** The oracle used in the Morpho market */
  readonly oracle: IAddress
  /** The interest rate module used in the Morpho market */
  readonly irm: IAddress
  /** The liquidation LTV for the Morpho market */
  readonly lltv: IRiskRatio
}

/**
 * @description Zod schema for IMorphoLendingPool
 */
export const MorphoLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: z.custom<IMorphoLendingPoolId>((val) => isMorphoLendingPoolId(val)),
  oracle: z.custom<IAddress>((val) => isAddress(val)),
  irm: z.custom<IAddress>((val) => isAddress(val)),
  lltv: z.custom<IRiskRatio>((val) => isRiskRatio(val)),
})

/**
 * Type for the data part of the IMorphoLendingPool interface
 */
export type IMorphoLendingPoolData = Readonly<z.infer<typeof MorphoLendingPoolDataSchema>>

/**
 * @description Type guard for IMorphoLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an IMorphoLendingPool
 */
export function isMorphoLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is IMorphoLendingPool {
  return MorphoLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
