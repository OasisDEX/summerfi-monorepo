import {
  IPosition,
  ITokenAmount,
  PositionDataSchema,
  PositionType,
  isTokenAmount,
} from '@summerfi/sdk-common/common'
import { z } from 'zod'
import { IArmadaPool, isArmadaPool } from './IArmadaPool'
import { IArmadaPositionId, isArmadaPositionId } from './IArmadaPositionId'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface IArmadaPosition
 * @description Interface for an Armada Protocol position
 */
export interface IArmadaPosition extends IPosition, IArmadaPositionData {
  /** Signature used to differentiate it from similar interfaces */
  readonly [__signature__]: symbol
  /** ID of the position */
  readonly id: IArmadaPositionId
  /** Pool where the position is opened */
  readonly pool: IArmadaPool
  /** Amount deposited in the Fleet */
  readonly amount: ITokenAmount
  /** Number of shares allocated to this position */
  readonly shares: ITokenAmount

  // Re-declaring to narrow the type
  readonly type: PositionType.Armada
}

/**
 * @description Zod schema for IArmadaPosition
 */
export const ArmadaPositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  id: z.custom<IArmadaPositionId>((val) => isArmadaPositionId(val)),
  pool: z.custom<IArmadaPool>((val) => isArmadaPool(val)),
  amount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  shares: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  deposits: z.array(z.custom<ITokenAmount>((val) => isTokenAmount(val))),
  withdrawals: z.array(z.custom<ITokenAmount>((val) => isTokenAmount(val))),
  type: z.literal(PositionType.Armada),
})

/**
 * Type for the data part of IArmadaPosition
 */
export type IArmadaPositionData = Readonly<z.infer<typeof ArmadaPositionDataSchema>>

/**
 * @description Type guard for IArmadaPosition
 * @param maybeArmadaPosition Object to be checked
 * @returns true if the object is a IArmadaPosition
 */
export function isArmadaPosition(
  maybeArmadaPosition: unknown,
): maybeArmadaPosition is IArmadaPosition {
  return ArmadaPositionDataSchema.safeParse(maybeArmadaPosition).success
}
