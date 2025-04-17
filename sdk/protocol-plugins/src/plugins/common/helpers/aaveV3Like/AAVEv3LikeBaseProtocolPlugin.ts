import { IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  CollateralInfo,
  DebtInfo,
  Denomination,
  FiatCurrency,
  ICollateralInfo,
  Maybe,
  Percentage,
  Price,
  RiskRatio,
  RiskRatioType,
  TokenAmount,
  IChainInfo,
  IToken,
} from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import { BaseProtocolPlugin } from '../../../../implementation/BaseProtocolPlugin'
import { ChainContractsProvider, GenericAbiMap } from '../../../utils/ChainContractProvider'
import { PRECISION_BI, UNCAPPED_SUPPLY } from '../../constants/AaveV3LikeConstants'
import { AllowedProtocolNames } from './AAVEv3LikeBuilderTypes'
import {
  AaveV3LikeProtocolDataBuilder,
  filterAssetsListByEMode,
  filterAssetsListByToken,
} from './AAVEv3LikeProtocolDataBuilder'

type AssetsList<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
> = Awaited<
  ReturnType<AAVEv3LikeBaseProtocolPlugin<ContractNames, ContractsAbiMap>['_getAssetsList']>
>
type Asset<ContractNames extends string, ContractsAbiMap extends GenericAbiMap<ContractNames>> =
  AssetsList<ContractNames, ContractsAbiMap> extends (infer U)[] ? U : never

/**
 * @class AAVEv3BaseProtocolPlugin
 * @description Base class for AAVEv3 protocol plugins, it contains common functionality to
 * fetch data from forks of AAVEv3 protocol.
 */
export abstract class AAVEv3LikeBaseProtocolPlugin<
  ContractNames extends string,
  ContractsAbiMap extends GenericAbiMap<ContractNames>,
> extends BaseProtocolPlugin {
  abstract readonly protocolName: AllowedProtocolNames

  private _dataProviderContractName: Maybe<ContractNames>
  private _oracleContractName: Maybe<ContractNames>
  private _contractsAbiProvider: Maybe<ChainContractsProvider<ContractNames, ContractsAbiMap>>
  private _assetsList: Maybe<AssetsList<ContractNames, ContractsAbiMap>> = undefined

  /** CONSTRUCTOR */
  initialize(params: {
    context: IProtocolPluginContext
    contractsAbiProvider: ChainContractsProvider<ContractNames, ContractsAbiMap>
    dataProviderContractName: ContractNames
    oracleContractName: ContractNames
  }) {
    super.initialize(params)

    this._contractsAbiProvider = params.contractsAbiProvider
    this._dataProviderContractName = params.dataProviderContractName
    this._oracleContractName = params.oracleContractName
  }

  /** PROTECTED */

  /**
   * Initializes the assets list if it hasn't been initialized yet.
   *
   * To be called before fetching data from the assets list, typically from `getLendingPool` and similar
   * methods.
   */
  protected async _inititalizeAssetsListIfNeeded(params: { chainInfo: IChainInfo }) {
    if (this._assetsList) {
      return
    }

    this._assetsList = await this._getAssetsList(params)
  }

  /**
   * Fetches the assets list for the protocol.
   * @returns The assets list for the protocol.
   *
   * This function must exist as the return type of the data builder is inferred from the return
   * type of this function.
   */
  protected async _getAssetsList(params: { chainInfo: IChainInfo }) {
    if (!this._dataProviderContractName) {
      throw new Error('Data provider contract name not initialized')
    }
    if (!this._oracleContractName) {
      throw new Error('Oracle contract name not initialized')
    }

    const builder = await new AaveV3LikeProtocolDataBuilder(
      this.context,
      this.protocolName,
      params.chainInfo,
      this.contractsAbiProvider,
      this._dataProviderContractName,
      this._oracleContractName,
    ).init()
    return await builder
      .addPrices()
      .addReservesCaps()
      .addReservesConfigData()
      .addReservesData()
      .addEmodeCategories()
      .build()
  }

  /**
   * Fetches the asset from the assets list for the given token and emode.
   * @param token  The token to fetch the asset for.
   * @param emode  The emode to fetch the asset for.
   * @returns  The asset for the given token and emode.
   */
  protected async _getAssetFromToken(
    token: IToken,
    emode: number,
  ): Promise<Asset<ContractNames, ContractsAbiMap>> {
    if (!this._assetsList) {
      throw new Error('Assets list not initialized')
    }

    const assetsMatchingToken = filterAssetsListByToken(this._assetsList, token)
    if (assetsMatchingToken.length === 0) {
      throw new Error(
        `${token} was not found in the protocols assets list, make sure the token is supported in both the protocol and the SDK`,
      )
    }

    const assetsMatchingTokenWithEmode = filterAssetsListByEMode(assetsMatchingToken, emode)
    if (assetsMatchingTokenWithEmode.length === 0) {
      throw new Error(
        `${token} was found in the protocols assets list but not with the given emode ${emode}`,
      )
    }
    if (assetsMatchingTokenWithEmode.length > 1) {
      console.warn(
        `${token} was found in the protocols assets list with multiple entries for the given emode ${emode}, using the first one`,
      )
    }

    return assetsMatchingTokenWithEmode[0]
  }

  /**
   * Fetches the collateral info for the given token.
   * @param token The token to fetch the collateral info for.
   * @param emode The emode to fetch the collateral info for.
   * @param poolBaseCurrencyToken The base currency token for the pool.
   * @returns The collateral info for the given token.
   */
  protected async _getCollateralInfo(params: {
    token: IToken
    emode: number
    poolBaseCurrencyToken: Denomination
  }): Promise<Maybe<ICollateralInfo>> {
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
          base: collateralToken,
          quote: poolBaseCurrencyToken,
          value: asset.price.toString(),
        }),
        priceUSD: Price.createFrom({
          base: collateralToken,
          quote: FiatCurrency.USD,
          value: asset.price.toString(),
        }),
        liquidationThreshold: RiskRatio.createFrom({
          value: Percentage.createFrom({
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
    token: IToken,
    emode: number,
    poolBaseCurrencyToken: Denomination,
  ): Promise<Maybe<DebtInfo>> {
    const asset = await this._getAssetFromToken(token, emode)

    const {
      token: quoteToken,
      config: { reserveFactor },
      caps: { borrowCap },
      data: { totalVariableDebt, totalStableDebt, variableBorrowRate },
    } = asset

    const assetDecimals = token.decimals
    const assetFactor = new BigNumber(10).pow(assetDecimals)
    const borrowCapWithDecimals = BigInt(
      new BigNumber(borrowCap.toString()).multipliedBy(assetFactor).toFixed(0),
    )

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
          base: quoteToken,
          quote: poolBaseCurrencyToken,
          value: new BigNumber(asset.price.toString()).toString(),
        }),
        priceUSD: Price.createFrom({
          base: quoteToken,
          quote: FiatCurrency.USD,
          value: new BigNumber(asset.price.toString()).toString(),
        }),
        interestRate: Percentage.createFrom({ value: rate }),
        totalBorrowed: TokenAmount.createFromBaseUnit({
          token: quoteToken,
          amount: totalBorrowed.toString(),
        }),
        debtCeiling: TokenAmount.createFrom({
          token: quoteToken,
          amount: borrowCapWithDecimals === 0n ? UNCAPPED_SUPPLY : borrowCapWithDecimals.toString(),
        }),
        debtAvailable: TokenAmount.createFromBaseUnit({
          token: quoteToken,
          amount:
            borrowCapWithDecimals === 0n
              ? UNCAPPED_SUPPLY
              : (borrowCapWithDecimals - totalBorrowed).toString(),
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

  get contractsAbiProvider(): ChainContractsProvider<ContractNames, ContractsAbiMap> {
    if (!this._contractsAbiProvider) {
      throw new Error('Contracts ABI provider not initialized')
    }

    return this._contractsAbiProvider
  }
}
