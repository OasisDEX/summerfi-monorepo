import {
  Percentage,
  TokenAmount,
  TokenSymbol,
  Price,
  CurrencySymbol,
  RiskRatio,
  Position,
  Token,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { BigNumber } from 'bignumber.js'

import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'

import { UNCAPPED_SUPPLY, PRECISION_BI } from '../../common/constants/AaveV3LikeConstants'
import { SparkLendingPool } from './SparkLendingPool'
import { SparkCollateralConfig } from './SparkCollateralConfig'
import { SparkDebtConfig } from './SparkDebtConfig'

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
import { ISparkLendingPoolIdData, isSparkLendingPoolId } from '../interfaces/ISparkLendingPoolId'
import { SparkStepBuilders } from '../builders/SparkStepBuilders'
import { AaveV3PositionId } from '../../aave-v3/implementation/AaveV3PositionId'
import { ISparkPositionIdData, isSparkPositionId } from '../interfaces'
import { ILendingPoolIdData, IPositionIdData, RiskRatioType } from '@summerfi/sdk-common'

type AssetsList = ReturnType<SparkProtocolPlugin['_buildAssetsList']>
type Asset = Awaited<AssetsList> extends (infer U)[] ? U : never

/**
 * @class SparkProtocolPlugin
 * @description Protocol plugin for the Spark protocol
 * @see BaseProtocolPlugin
 */
export class SparkProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName: ProtocolName.Spark = ProtocolName.Spark
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = SparkStepBuilders

  constructor(params: { context: IProtocolPluginContext; deploymentConfigTag?: string }) {
    super(params)
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

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getPosition */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPosition(positionId: AaveV3PositionId): Promise<Position> {
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

  private async _buildAssetsList(emode: bigint) {
    try {
      const _ctx = {
        ...this.ctx,
        getContractDef: this._getContractDef,
      }
      const builder = await new AaveV3LikeProtocolDataBuilder(_ctx, this.protocolName).init()
      const list = await builder
        .addPrices()
        .addReservesCaps()
        .addReservesConfigData()
        .addReservesData()
        .addEmodeCategories()
        .build()

      return filterAssetsListByEMode(list, emode)
    } catch (e) {
      throw new Error(`Could not fetch/build assets list for Spark: ${JSON.stringify(e)}`)
    }
  }

  private _getCollateralAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: Token | CurrencySymbol,
  ): SparkCollateralConfig {
    const {
      token: collateralToken,
      config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus },
      caps: { supplyCap },
      data: { totalAToken },
    } = asset
    const LTV_TO_PERCENTAGE_DIVISOR = 100n

    try {
      return {
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
        maxLtv: RiskRatio.createFrom({
          ratio: Percentage.createFrom({
            value: Number((ltv / LTV_TO_PERCENTAGE_DIVISOR).toString()),
          }),
          type: RiskRatioType.LTV,
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({
            value: Number((liquidationThreshold / LTV_TO_PERCENTAGE_DIVISOR).toString()),
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
          value: Number((liquidationBonus / LTV_TO_PERCENTAGE_DIVISOR).toString()),
        }),
        apy: Percentage.createFrom({ value: 0 }),
        usageAsCollateralEnabled,
      }
    } catch (e) {
      throw new Error(`error in collateral loop ${e}`)
    }
  }

  private _getDebtAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: CurrencySymbol | Token,
  ): Maybe<SparkDebtConfig> {
    const {
      token: quoteToken,
      config: { borrowingEnabled, reserveFactor },
      caps: { borrowCap },
      data: { totalVariableDebt, totalStableDebt, variableBorrowRate },
    } = asset
    if (quoteToken.symbol === TokenSymbol.WETH) {
      // WETH can be used as collateral on Spark but not borrowed.
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
      return {
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
        rate: Percentage.createFrom({ value: rate }),
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
        borrowingEnabled,
      }
    } catch (e) {
      throw new Error(`error in debt loop ${e}`)
    }
  }
}

/**
         const emode = sparkEmodeCategoryMap[poolId.emodeType]

    const ctx = this.ctx
    const chainId = ctx.provider.chain?.id
    if (!chainId) throw new Error('ctx.provider.chain.id undefined')

    if (!this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }

    const assetsList = await this.buildAssetsList(emode)

    // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
    const poolBaseCurrencyToken = CurrencySymbol.USD

     const collaterals = assetsList.reduce<SparkCollateralConfigRecord>((colls, asset) => {
      const assetInfo = this.getCollateralAssetInfo(asset, poolBaseCurrencyToken)
      const { token: collateralToken } = asset
      colls[collateralToken.address.value] = assetInfo
      return colls
    }, {})
    const debts = assetsList.reduce<SparkDebtConfigRecord>((debts, asset) => {
      const assetInfo = this.getDebtAssetInfo(asset, poolBaseCurrencyToken)
      if (!assetInfo) return debts
      const { token: quoteToken } = asset
      debts[quoteToken.address.value] = assetInfo
      return debts
    }, {})
 */
