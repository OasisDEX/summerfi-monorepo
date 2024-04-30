import {
  Percentage,
  TokenAmount,
  Price,
  CurrencySymbol,
  RiskRatio,
  Position,
  Token,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
  IPositionIdData,
  TokenSymbol,
} from '@summerfi/sdk-common/common'
import {
  CollateralInfo,
  DebtInfo,
  ILendingPoolIdData,
  PoolType,
  ProtocolName,
} from '@summerfi/sdk-common/protocols'
import { BigNumber } from 'bignumber.js'

import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'

import { UNCAPPED_SUPPLY, PRECISION_BI } from '../../common/constants/AaveV3LikeConstants'
import { SparkLendingPool } from './SparkLendingPool'

import {
  AaveV3LikeProtocolDataBuilder,
  filterAssetsListByEMode,
} from '../../common/helpers/AAVEv3LikeProtocolDataBuilder'
import { SparkContractNames } from '@summerfi/deployment-types'
import {
  SPARK_LENDING_POOL_ABI,
  SPARK_ORACLE_ABI,
  SPARK_POOL_DATA_PROVIDER_ABI,
} from '../abis/SparkABIS'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { SparkAddressAbiMap } from '../types/SparkAddressAbiMap'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  isSparkLendingPoolId,
} from '../interfaces/ISparkLendingPoolId'
import { SparkStepBuilders } from '../builders/SparkStepBuilders'
import { ISparkPositionIdData, isSparkPositionId } from '../interfaces'
import { RiskRatioType } from '@summerfi/sdk-common'
import { IAaveV3PositionIdData } from '../../aave-v3'
import { SparkLendingPoolInfo } from './SparkLendingPoolInfo'
import { sparkEmodeCategoryMap } from './EmodeCategoryMap'

type AssetsList = Awaited<ReturnType<SparkProtocolPlugin['_getAssetsList']>>
type Asset = AssetsList extends (infer U)[] ? U : never

/**
 * @class SparkProtocolPlugin
 * @description Protocol plugin for the Spark protocol
 * @see BaseProtocolPlugin
 */
export class SparkProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName: ProtocolName.Spark = ProtocolName.Spark
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = SparkStepBuilders
  private _assetsList: Maybe<AssetsList>

  constructor(params: { context: IProtocolPluginContext; deploymentConfigTag?: string }) {
    super(params)

    if (
      !this.supportedChains.some(
        (chainInfo) => chainInfo.chainId === this.context.provider.chain?.id,
      )
    ) {
      throw new Error(`Chain ID ${this.context.provider.chain?.id} is not supported`)
    }
  }

  /** VALIDATORS */

  /** @see BaseProtocolPlugin._validateLendingPoolId */
  protected _validateLendingPoolId(
    candidate: ILendingPoolIdData,
  ): asserts candidate is ISparkLendingPoolIdData {
    if (!isSparkLendingPoolId(candidate)) {
      throw new Error(`Invalid Spark pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** @see BaseProtocolPlugin._validatePositionId */
  protected _validatePositionId(
    candidate: IPositionIdData,
  ): asserts candidate is ISparkPositionIdData {
    if (!isSparkPositionId(candidate)) {
      throw new Error(`Invalid Spark position ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** LENDING POOLS */

  /** @see BaseProtocolPlugin._getLendingPoolImpl */
  protected async _getLendingPoolImpl(poolId: ISparkLendingPoolIdData): Promise<SparkLendingPool> {
    return SparkLendingPool.createFrom({
      type: PoolType.Lending,
      id: poolId,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  protected async _getLendingPoolInfoImpl(
    sparkPoolId: ISparkLendingPoolId,
  ): Promise<SparkLendingPoolInfo> {
    this._inititalizeAssetsListIfNeeded()

    const emode = sparkEmodeCategoryMap[sparkPoolId.emodeType]

    const collateralInfo = await this._getCollateralInfo({
      token: sparkPoolId.collateralToken,
      emode: emode,
      poolBaseCurrencyToken: CurrencySymbol.USD,
    })
    if (!collateralInfo) {
      throw new Error(`Collateral info not found for ${sparkPoolId.collateralToken}`)
    }

    const debtInfo = await this._getDebtInfo(sparkPoolId.debtToken, emode, CurrencySymbol.USD)
    if (!debtInfo) {
      throw new Error(`Debt info not found for ${sparkPoolId.debtToken}`)
    }

    return SparkLendingPoolInfo.createFrom({
      type: PoolType.Lending,
      id: sparkPoolId,
      collateral: collateralInfo,
      debt: debtInfo,
    })
  }

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getPosition */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPosition(positionId: IAaveV3PositionIdData): Promise<Position> {
    this._validatePositionId(positionId)

    throw new Error(`Not implemented ${positionId}`)
  }

  /** IMPORT POSITIONS */

  /** @see BaseProtocolPlugin.getImportPositionTransaction */
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    throw new Error(`Not implemented ${params}`)
  }

  /** PRIVATE */

  private _getContractDef<K extends SparkContractNames>(contractName: K): SparkAddressAbiMap[K] {
    const map: SparkAddressAbiMap = {
      Oracle: {
        address: '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9',
        abi: SPARK_ORACLE_ABI,
      },
      PoolDataProvider: {
        address: '0xFc21d6d146E6086B8359705C8b28512a983db0cb',
        abi: SPARK_POOL_DATA_PROVIDER_ABI,
      },
      SparkLendingPool: {
        address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
        abi: SPARK_LENDING_POOL_ABI,
      },
    }

    return map[contractName]
  }

  private async _inititalizeAssetsListIfNeeded() {
    if (this._assetsList) {
      return
    }

    this._assetsList = await this._getAssetsList()
  }

  private async _getAssetsList() {
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

  private async _getAssetFromToken(token: Token, emode: bigint): Promise<Asset> {
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

  private async _getCollateralInfo(params: {
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

  private async _getDebtInfo(
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
    if (quoteToken.symbol === TokenSymbol.WETH) {
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
