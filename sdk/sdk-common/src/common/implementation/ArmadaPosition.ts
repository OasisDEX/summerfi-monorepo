import type { IFiatCurrencyAmount } from '../..'
import { SerializationService } from '../../services/SerializationService'
import { PositionType } from '../enums/PositionType'
import { __signature__ } from '../interfaces/IArmadaPosition'
import type { IArmadaPosition, IArmadaPositionData } from '../interfaces/IArmadaPosition'
import type { IArmadaPositionId } from '../interfaces/IArmadaPositionId'
import type { IArmadaVault } from '../interfaces/IArmadaVault'
import type { ITokenAmount } from '../interfaces/ITokenAmount'
import { Position } from './Position'

/**
 * Type for the parameters of ArmadaPosition
 */
export type ArmadaPositionParameters = Omit<IArmadaPositionData, 'type'>

/**
 * @class ArmadaPosition
 * @see IArmadaPosition
 */
export class ArmadaPosition extends Position implements IArmadaPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type = PositionType.Armada
  readonly id: IArmadaPositionId
  readonly pool: IArmadaVault
  readonly assets: ITokenAmount
  readonly assetPriceUSD: IFiatCurrencyAmount
  readonly assetsUSD: IFiatCurrencyAmount
  readonly shares: ITokenAmount
  readonly depositsAmount: ITokenAmount
  readonly depositsAmountUSD: IFiatCurrencyAmount
  readonly withdrawalsAmount: ITokenAmount
  readonly withdrawalsAmountUSD: IFiatCurrencyAmount
  readonly netDeposits: ITokenAmount
  readonly netDepositsUSD: IFiatCurrencyAmount
  readonly earnings: ITokenAmount
  readonly earningsUSD: IFiatCurrencyAmount
  readonly claimedSummerToken: ITokenAmount
  readonly claimableSummerToken: ITokenAmount
  readonly rewards: Array<{
    claimed: ITokenAmount
    claimable: ITokenAmount
  }>

  /** @deprecated Use assets instead */
  readonly amount: ITokenAmount
  /** @deprecated do not use */
  readonly deposits: { amount: ITokenAmount; timestamp: number }[]
  /** @deprecated do not use */
  readonly withdrawals: { amount: ITokenAmount; timestamp: number }[]

  /** FACTORY */
  static createFrom(params: ArmadaPositionParameters): ArmadaPosition {
    return new ArmadaPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ArmadaPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
    this.assets = params.assets
    this.assetPriceUSD = params.assetPriceUSD
    this.assetsUSD = params.assetsUSD
    this.shares = params.shares
    this.depositsAmount = params.depositsAmount
    this.depositsAmountUSD = params.depositsAmountUSD
    this.withdrawalsAmount = params.withdrawalsAmount
    this.withdrawalsAmountUSD = params.withdrawalsAmountUSD
    this.netDeposits = params.netDeposits
    this.netDepositsUSD = params.netDepositsUSD
    this.earnings = params.earnings
    this.earningsUSD = params.earningsUSD
    this.claimedSummerToken = params.claimedSummerToken
    this.claimableSummerToken = params.claimableSummerToken
    this.rewards = params.rewards

    this.amount = params.amount
    this.deposits = params.deposits
    this.withdrawals = params.withdrawals
  }
}

SerializationService.registerClass(ArmadaPosition, { identifier: 'ArmadaPosition' })
