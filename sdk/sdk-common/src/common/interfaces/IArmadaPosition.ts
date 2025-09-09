import { z } from 'zod'
import { type IArmadaVault, isArmadaVault } from './IArmadaVault'
import { type IArmadaPositionId, isArmadaPositionId } from './IArmadaPositionId'
import { PositionDataSchema, type IPosition } from './IPosition'
import { isTokenAmount, type ITokenAmount } from './ITokenAmount'
import { PositionType } from '../enums/PositionType'
import { isFiatCurrencyAmount, type IFiatCurrencyAmount } from './IFiatCurrencyAmount'

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
  readonly pool: IArmadaVault
  /** Amount deposited in the Fleet */
  readonly amount: ITokenAmount
  /** Number of shares allocated to this position */
  readonly shares: ITokenAmount

  /** Total amount deposited in the Fleet */
  readonly depositsAmount: ITokenAmount
  /** Total amount withdrawn from the Fleet */
  readonly withdrawalsAmount: ITokenAmount

  /** Total amount deposited in the Fleet in USD */
  readonly depositsAmountUSD: IFiatCurrencyAmount
  /** Total amount withdrawn from the Fleet in USD */
  readonly withdrawalsAmountUSD: IFiatCurrencyAmount

  /** Claimed SUMR rewards */
  readonly claimedSummerToken: ITokenAmount
  /** Claimable SUMR rewards */
  readonly claimableSummerToken: ITokenAmount
  /** Reward assets for this position */
  readonly rewards: Array<{
    claimed: ITokenAmount
    claimable: ITokenAmount
  }>

  // Re-declaring to narrow the type
  readonly type: PositionType.Armada
}

/**
 * @description Zod schema for IArmadaPosition
 */
export const ArmadaPositionDataSchema = z.object({
  ...PositionDataSchema.shape,
  id: z.custom<IArmadaPositionId>((val) => isArmadaPositionId(val)),
  pool: z.custom<IArmadaVault>((val) => isArmadaVault(val)),
  amount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  shares: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  depositsAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  withdrawalsAmount: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  depositsAmountUSD: z.custom<IFiatCurrencyAmount>((val) => isFiatCurrencyAmount(val)),
  withdrawalsAmountUSD: z.custom<IFiatCurrencyAmount>((val) => isFiatCurrencyAmount(val)),
  /* @deprecated do not use */
  deposits: z.array(
    z.object({ amount: z.custom<ITokenAmount>(isTokenAmount), timestamp: z.number() }),
  ),
  /* @deprecated do not use */
  withdrawals: z.array(
    z.object({ amount: z.custom<ITokenAmount>(isTokenAmount), timestamp: z.number() }),
  ),
  claimedSummerToken: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  claimableSummerToken: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  rewards: z.array(
    z.object({
      claimed: z.custom<ITokenAmount>(isTokenAmount),
      claimable: z.custom<ITokenAmount>(isTokenAmount),
    }),
  ),
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
