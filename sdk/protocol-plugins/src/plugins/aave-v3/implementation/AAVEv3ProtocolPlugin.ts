import {
  Percentage,
  TokenAmount,
  Token,
  TokenSymbol,
  Price,
  CurrencySymbol,
  RiskRatio,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
  IPosition,
  IPositionId,
  IPositionIdData,
  RiskRatioType,
} from '@summerfi/sdk-common/common'
import { ILendingPoolIdData, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { BigNumber } from 'bignumber.js'
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'

import {
  AaveV3LikeProtocolDataBuilder,
  filterAssetsListByEMode,
} from '../../common/helpers/AAVEv3LikeProtocolDataBuilder'
import { UNCAPPED_SUPPLY, PRECISION_BI } from '../../common/constants/AaveV3LikeConstants'
import { AaveV3LendingPool } from './AaveV3LendingPool'
import { AaveV3CollateralConfig } from './AaveV3CollateralConfig'
import { AaveV3DebtConfig } from './AaveV3DebtConfig'
import { AaveV3AddressAbiMap } from '../types/AaveV3AddressAbiMap'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  AAVEV3_LENDING_POOL_ABI,
  AAVEV3_ORACLE_ABI,
  AAVEV3_POOL_DATA_PROVIDER_ABI,
} from '../abis/AaveV3ABIS'
import { AaveV3ContractNames } from '@summerfi/deployment-types'
import { IAaveV3LendingPoolIdData, isAaveV3LendingPoolId } from '../interfaces/IAaveV3LendingPoolId'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import { AaveV3StepBuilders } from '../builders'
import { AaveV3LendingPoolId } from './AaveV3LendingPoolId'
import { IAaveV3PositionIdData, isAaveV3PositionId } from '../interfaces/IAaveV3PositionId'

type AssetsList = ReturnType<AaveV3ProtocolPlugin['_buildAssetsList']>
type Asset = Awaited<AssetsList> extends (infer U)[] ? U : never

/**
 * @class AaveV3ProtocolPlugin
 * @description Aave V3 protocol plugin
 * @see BaseProtocolPlugin
 */
export class AaveV3ProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName = ProtocolName.AAVEv3
  readonly supportedChains = valuesOfChainFamilyMap([
    ChainFamilyName.Ethereum,
    ChainFamilyName.Base,
    ChainFamilyName.Arbitrum,
    ChainFamilyName.Optimism,
  ])
  readonly stepBuilders: Partial<ActionBuildersMap> = AaveV3StepBuilders

  constructor(params: { context: IProtocolPluginContext; deploymentConfigTag?: string }) {
    super(params)
  }

  /** VALIDATORS */

  /** @see BaseProtocolPlugin._validateLendingPoolId */
  protected _validateLendingPoolId(
    candidate: ILendingPoolIdData,
  ): asserts candidate is IAaveV3LendingPoolIdData {
    if (!isAaveV3LendingPoolId(candidate)) {
      throw new Error(`Invalid AaveV3 pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** @see BaseProtocolPlugin.validateLendingPoolId */
  protected _validatePositionId(
    candidate: IPositionIdData,
  ): asserts candidate is IAaveV3PositionIdData {
    if (!isAaveV3PositionId(candidate)) {
      throw new Error(`Invalid AaveV3 position ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** LENDING POOLS */

  /** @see BaseProtocolPlugin._getLendingPoolImpl */
  async _getLendingPoolImpl(aaveV3PoolId: AaveV3LendingPoolId): Promise<AaveV3LendingPool> {
    return AaveV3LendingPool.createFrom({
      type: PoolType.Lending,
      id: aaveV3PoolId,
    })
  }

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getPosition */
  async getPosition(positionId: IPositionId): Promise<IPosition> {
    throw new Error(`Not implemented ${positionId}`)
  }

  /** IMPORT TRANSACTIONS */

  /** @see BaseProtocolPlugin.getImportPositionTransaction */
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    throw new Error(`Not implemented ${params}`)
  }

  /** PRIVATE */

  private _getContractDef<K extends AaveV3ContractNames>(contractName: K): AaveV3AddressAbiMap[K] {
    // TODO: Need to be driven by ChainId in future
    const map: AaveV3AddressAbiMap = {
      Oracle: {
        address: '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9',
        abi: AAVEV3_ORACLE_ABI,
      },
      PoolDataProvider: {
        address: '0xFc21d6d146E6086B8359705C8b28512a983db0cb',
        abi: AAVEV3_POOL_DATA_PROVIDER_ABI,
      },
      AavePool: {
        address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
        abi: AAVEV3_LENDING_POOL_ABI,
      },
      AaveL2Encoder: {
        address: '0x',
        abi: null,
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
      throw new Error(`Could not fetch/build assets list for AAVEv3: ${JSON.stringify(e)}`)
    }
  }

  private _getCollateralAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: Token | CurrencySymbol,
  ): AaveV3CollateralConfig {
    const {
      token: collateralToken,
      config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus },
      caps: { supplyCap },
      data: { totalAToken },
    } = asset

    const LTV_TO_PERCENTAGE_DIVISOR = new BigNumber(100)

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
            value: new BigNumber(ltv.toString()).div(LTV_TO_PERCENTAGE_DIVISOR).toNumber(),
          }),
          type: RiskRatioType.LTV,
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
  ): Maybe<AaveV3DebtConfig> {
    const {
      token: quoteToken,
      config: { borrowingEnabled, reserveFactor },
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
 const emode = aaveV3EmodeCategoryMap[aaveV3PoolId.emodeType]

    const ctx = this.ctx
    const chainId = ctx.provider.chain?.id
    if (!chainId) throw new Error('ctx.provider.chain.id undefined')

    if (!this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }

    const assetsList = await this.buildAssetsList(emode)

    // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
    const poolBaseCurrencyToken = CurrencySymbol.USD

    const collaterals = assetsList.reduce<AaveV3CollateralConfigRecord>((colls, asset) => {
      const assetInfo = this.getCollateralAssetInfo(asset, poolBaseCurrencyToken)
      const { token: collateralToken } = asset
      colls[collateralToken.address.value] = assetInfo
      return colls
    }, {})

    const debts = assetsList.reduce<AaveV3DebtConfigRecord>((debts, asset) => {
      const assetInfo = this.getDebtAssetInfo(asset, poolBaseCurrencyToken)
      if (!assetInfo) return debts
      const { token: quoteToken } = asset
      debts[quoteToken.address.value] = assetInfo
      return debts
    }, {})

    
 */
