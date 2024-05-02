import {
  CollateralInfo,
  CurrencySymbol,
  DebtInfo,
  Maybe,
  Percentage,
  Price,
  RiskRatio,
  RiskRatioType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { BaseProtocolPlugin } from '../../../../implementation/BaseProtocolPlugin'
import { AAVEv3LikeAbiInfo } from './AAVEv3LikeAbi'
import {
  AaveV3LikeProtocolDataBuilder,
  filterAssetsListByEMode,
} from './AAVEv3LikeProtocolDataBuilder'
import { AllowedProtocolNames } from './AAVEv3LikeBuilderTypes'
import { BigNumber } from 'bignumber.js'
import { PRECISION_BI, UNCAPPED_SUPPLY } from '../../constants/AaveV3LikeConstants'
import { CommonTokenSymbols } from '@summerfi/sdk-common/common'

type AssetsList = Awaited<ReturnType<AAVEv3BaseProtocolPlugin['_getAssetsList']>>
type Asset = AssetsList extends (infer U)[] ? U : never

/**
 * @class AAVEv3BaseProtocolPlugin
 * @description Base class for AAVEv3 protocol plugins, it contains common functionality to
 * fetch data from forks of AAVEv3 protocol.
 */
export abstract class AAVEv3BaseProtocolPlugin extends BaseProtocolPlugin {
  abstract readonly protocolName: AllowedProtocolNames
  private _assetsList: Maybe<AssetsList> = undefined

  /** PROTECTED */

  /**
   * Fetches the contract definition for the given contract name.
   * @param contractName The name of the contract to fetch the definition for.
   * @returns The contract definition for the given contract name.
   *
   * To be implemented by each specific protocol plugin.
   */
  protected abstract _getContractDef(contractName: string): AAVEv3LikeAbiInfo

  /**
   * Initializes the assets list if it hasn't been initialized yet.
   *
   * To be called before fetching data from the assets list, typically from `getLendingPool` and similar
   * methods.
   */
  protected async _inititalizeAssetsListIfNeeded() {
    if (this._assetsList) {
      return
    }

    this._assetsList = await this._getAssetsList()
  }

  /**
   * Fetches the assets list for the protocol.
   * @returns The assets list for the protocol.
   *
   * This function must exist as the return type of the data builder is inferred from the return
   * type of this function.
   */
  protected async _getAssetsList() {
    try {
      const _ctx = {
        ...this.ctx,
        getContractDef: this._getContractDef,
      }
      const builder = await new AaveV3LikeProtocolDataBuilder(_ctx, this.protocolName).init()
      return await builder
        .addPrices()
        .addReservesCaps()
        .addReservesConfigData()
        .addReservesData()
        .addEmodeCategories()
        .build()
    } catch (e) {
      throw new Error(`Could not fetch/build assets list for AAVEv3: ${JSON.stringify(e)}`)
    }
  }

  /**
   * Fetches the asset from the assets list for the given token and emode.
   * @param token  The token to fetch the asset for.
   * @param emode  The emode to fetch the asset for.
   * @returns  The asset for the given token and emode.
   */
  protected async _getAssetFromToken(token: Token, emode: bigint): Promise<Asset> {
    if (!this._assetsList) {
      throw new Error('Assets list not initialized')
    }

    const assetsList = filterAssetsListByEMode(this._assetsList, emode)

    const asset = assetsList.find((asset: Asset) => token.equals(asset.token))
    if (!asset) {
      throw new Error(`Asset not found for token ${token}`)
    }

    return asset
  }

  /**
   * Fetches the collateral info for the given token.
   * @param token The token to fetch the collateral info for.
   * @param emode The emode to fetch the collateral info for.
   * @param poolBaseCurrencyToken The base currency token for the pool.
   * @returns The collateral info for the given token.
   */
  protected async _getCollateralInfo(params: {
    token: Token
    emode: bigint
    poolBaseCurrencyToken: Token | CurrencySymbol
  }): Promise<Maybe<CollateralInfo>> {
    const { token, emode, poolBaseCurrencyToken } = params

    const asset = await this._getAssetFromToken(token, emode)

    const {
      token: collateralToken,
      config: { liquidationThreshold, liquidationBonus },
      caps: { supplyCap },
      data: { totalAToken },
    } = asset

    const LTV_TO_PERCENTAGE_DIVISOR = new BigNumber(100)

    try {
      return CollateralInfo.createFrom({
        token: collateralToken,
        price: Price.createFrom({
          baseToken: collateralToken,
          quoteToken: poolBaseCurrencyToken,
          value: asset.price.toString(),
        }),
        priceUSD: Price.createFrom({
          baseToken: collateralToken,
          quoteToken: CurrencySymbol.USD,
          value: asset.price.toString(),
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({
            value: new BigNumber(liquidationThreshold.toString())
              .div(LTV_TO_PERCENTAGE_DIVISOR)
              .toNumber(),
          }),
          type: RiskRatioType.LTV,
        }),
        tokensLocked: TokenAmount.createFromBaseUnit({
          token: collateralToken,
          amount: totalAToken.toString(),
        }),
        maxSupply: TokenAmount.createFrom({
          token: collateralToken,
          amount: supplyCap === 0n ? UNCAPPED_SUPPLY : supplyCap.toString(),
        }),
        liquidationPenalty: Percentage.createFrom({
          value: new BigNumber(liquidationBonus.toString())
            .div(LTV_TO_PERCENTAGE_DIVISOR)
            .toNumber(),
        }),
      })
    } catch (e) {
      throw new Error(`error in collateral loop ${e}`)
    }
  }

  /**
   * Fetches the debt info for the given token.
   * @param token The token to fetch the debt info for.
   * @param emode The emode to fetch the debt info for.
   * @param poolBaseCurrencyToken The base currency token for the pool.
   * @returns The debt info for the given token.
   */
  protected async _getDebtInfo(
    token: Token,
    emode: bigint,
    poolBaseCurrencyToken: CurrencySymbol | Token,
  ): Promise<Maybe<DebtInfo>> {
    const asset = await this._getAssetFromToken(token, emode)

    const {
      token: quoteToken,
      config: { reserveFactor },
      caps: { borrowCap },
      data: { totalVariableDebt, totalStableDebt, variableBorrowRate },
    } = asset
    if (quoteToken.symbol === CommonTokenSymbols.WETH) {
      // WETH can be used as collateral on AaveV3 but not borrowed.
      return
    }

    try {
      const RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR = 10000n
      const PRECISION_PRESERVING_OFFSET = 1000000n
      const RATE_DIVISOR_TO_GET_PERCENTAGE = Number((PRECISION_PRESERVING_OFFSET - 100n).toString())

      const rate =
        Number(((variableBorrowRate * PRECISION_PRESERVING_OFFSET) / PRECISION_BI.RAY).toString()) /
        RATE_DIVISOR_TO_GET_PERCENTAGE
      const totalBorrowed = totalVariableDebt + totalStableDebt
      return DebtInfo.createFrom({
        token: quoteToken,
        // TODO: If we further restricted pools we could have token pair prices
        price: Price.createFrom({
          baseToken: quoteToken,
          quoteToken: poolBaseCurrencyToken,
          value: new BigNumber(asset.price.toString()).toString(),
        }),
        priceUSD: Price.createFrom({
          baseToken: quoteToken,
          quoteToken: CurrencySymbol.USD,
          value: new BigNumber(asset.price.toString()).toString(),
        }),
        interestRate: Percentage.createFrom({ value: rate }),
        totalBorrowed: TokenAmount.createFromBaseUnit({
          token: quoteToken,
          amount: totalBorrowed.toString(),
        }),
        debtCeiling: TokenAmount.createFrom({
          token: quoteToken,
          amount: borrowCap === 0n ? UNCAPPED_SUPPLY : borrowCap.toString(),
        }),
        debtAvailable: TokenAmount.createFromBaseUnit({
          token: quoteToken,
          amount: borrowCap === 0n ? UNCAPPED_SUPPLY : (borrowCap - totalBorrowed).toString(),
        }),
        dustLimit: TokenAmount.createFromBaseUnit({ token: quoteToken, amount: '0' }),
        originationFee: Percentage.createFrom({
          value: Number((reserveFactor / RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR).toString()),
        }),
      })
    } catch (e) {
      throw new Error(`error in debt loop ${e}`)
    }
  }
}
