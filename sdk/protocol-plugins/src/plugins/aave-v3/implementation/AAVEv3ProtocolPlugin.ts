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
import {
  DebtInfo,
  ILendingPoolIdData,
  PoolType,
  ProtocolName,
} from '@summerfi/sdk-common/protocols'
import { BigNumber } from 'bignumber.js'
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'

import {
  AaveV3LikeProtocolDataBuilder,
  filterAssetsListByEMode,
} from '../../common/helpers/AAVEv3LikeProtocolDataBuilder'
import { UNCAPPED_SUPPLY, PRECISION_BI } from '../../common/constants/AaveV3LikeConstants'
import { AaveV3LendingPool } from './AaveV3LendingPool'
import { AaveV3AddressAbiMap } from '../types/AaveV3AddressAbiMap'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  AAVEV3_LENDING_POOL_ABI,
  AAVEV3_ORACLE_ABI,
  AAVEV3_POOL_DATA_PROVIDER_ABI,
} from '../abis/AaveV3ABIS'
import { AaveV3ContractNames } from '@summerfi/deployment-types'
import {
  IAaveV3LendingPoolId,
  IAaveV3LendingPoolIdData,
  isAaveV3LendingPoolId,
} from '../interfaces/IAaveV3LendingPoolId'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import { AaveV3StepBuilders } from '../builders'
import { IAaveV3PositionIdData, isAaveV3PositionId } from '../interfaces/IAaveV3PositionId'
import { CollateralInfo } from '@summerfi/sdk-common'
import { AaveV3LendingPoolInfo } from './AaveV3LendingPoolInfo'
import { aaveV3EmodeCategoryMap } from './EmodeCategoryMap'

type AssetsList = Awaited<ReturnType<AaveV3ProtocolPlugin['_getAssetsList']>>
type Asset = AssetsList extends (infer U)[] ? U : never

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
  async _getLendingPoolImpl(aaveV3PoolId: IAaveV3LendingPoolId): Promise<AaveV3LendingPool> {
    return AaveV3LendingPool.createFrom({
      type: PoolType.Lending,
      id: aaveV3PoolId,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  async _getLendingPoolInfoImpl(
    aaveV3PoolId: IAaveV3LendingPoolId,
  ): Promise<AaveV3LendingPoolInfo> {
    this._inititalizeAssetsListIfNeeded()

    const emode = aaveV3EmodeCategoryMap[aaveV3PoolId.emodeType]

    const collateralInfo = await this._getCollateralInfo({
      token: aaveV3PoolId.collateralToken,
      emode: emode,
      poolBaseCurrencyToken: CurrencySymbol.USD,
    })
    if (!collateralInfo) {
      throw new Error(`Collateral info not found for ${aaveV3PoolId.collateralToken}`)
    }

    const debtInfo = await this._getDebtInfo(aaveV3PoolId.debtToken, emode, CurrencySymbol.USD)
    if (!debtInfo) {
      throw new Error(`Debt info not found for ${aaveV3PoolId.debtToken}`)
    }

    return AaveV3LendingPoolInfo.createFrom({
      type: PoolType.Lending,
      id: aaveV3PoolId,
      collateral: collateralInfo,
      debt: debtInfo,
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
