import {AaveV2ContractNames} from "@summerfi/deployment-types";
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
  ChainId,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import {BigNumber} from "bignumber.js";
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'
import {AaveV3ProtocolPlugin} from "../../aave-v3";
import {PRECISION_BI, UNCAPPED_SUPPLY} from "../../common/constants/AaveV3LikeConstants";
import {AaveLikeProtocolDataBuilder} from "../../common/helpers/AaveLikeProtocolDataBuilder";
import {AAVEV2_LENDING_POOL_ABI, AAVEV2_ORACLE_ABI, AAVEV2_POOL_DATA_PROVIDER_ABI} from "../abis/AaveV2ABIS";

import { AaveV2LendingPool } from './AaveV2LendingPool'
import { AaveV2CollateralConfig } from './AaveV2CollateralConfig'
import { AaveV2DebtConfig } from './AaveV2DebtConfig'
import {
  AaveV2CollateralConfigMap,
  AaveV2CollateralConfigRecord,
} from './AaveV2CollateralConfigMap'
import { AaveV2DebtConfigMap, AaveV2DebtConfigRecord } from './AaveV2DebtConfigMap'
import { z } from 'zod'
import { AaveV2AddressAbiMap } from '../types/AaveV2AddressAbiMap'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { AaveV2PoolId } from '../types/AaveV2PoolId'

type AssetsList = ReturnType<AaveV3ProtocolPlugin['buildAssetsList']>
type Asset = Awaited<AssetsList> extends (infer U)[] ? U : never

export class AaveV2ProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName = ProtocolName.AAVEv2
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = {}

  readonly aaveV2PoolidSchema = z.object({
    protocol: z.object({
      name: z.literal(ProtocolName.AAVEv2),
      chainInfo: z.object({
        name: z.string(),
        chainId: z.custom<ChainId>(
          (chainId) => this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId),
          'Chain ID not supported',
        ),
      }),
    }),
  })

  constructor(params: { context: IProtocolPluginContext }) {
    super(params)
  }

  isPoolId(candidate: unknown): candidate is AaveV2PoolId {
    return this._isPoolId(candidate, this.aaveV2PoolidSchema)
  }

  validatePoolId(candidate: unknown): asserts candidate is AaveV2PoolId {
    if (!this.isPoolId(candidate)) {
      throw new Error(`Invalid AaveV2 pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  async getPool(aaveV2PoolId: unknown): Promise<AaveV2LendingPool> {
    this.validatePoolId(aaveV2PoolId)

    const ctx = this.ctx
    const chainId = ctx.provider.chain?.id
    if (!chainId) throw new Error('ctx.provider.chain.id undefined')

    if (!this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }

    const assetsList = await this.buildAssetsList()

    // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
    const poolBaseCurrencyToken = CurrencySymbol.USD

    const collaterals = assetsList.reduce<AaveV2CollateralConfigRecord>((colls, asset) => {
      const assetInfo = this.getCollateralAssetInfo(asset, poolBaseCurrencyToken)
      const { token: collateralToken } = asset
      colls[collateralToken.address.value] = assetInfo
      return colls
    }, {})

    const debts = assetsList.reduce<AaveV2DebtConfigRecord>((debts, asset) => {
      const assetInfo = this.getDebtAssetInfo(asset, poolBaseCurrencyToken)
      if (!assetInfo) return debts
      const { token: quoteToken } = asset
      debts[quoteToken.address.value] = assetInfo
      return debts
    }, {})

    return AaveV2LendingPool.createFrom({
      type: PoolType.Lending,
      poolId: aaveV2PoolId,
      protocol: aaveV2PoolId.protocol,
      baseCurrency: CurrencySymbol.USD,
      collaterals: AaveV2CollateralConfigMap.createFrom({ record: collaterals }),
      debts: AaveV2DebtConfigMap.createFrom({ record: debts }),
    })
  }

  async getPosition(positionId: string): Promise<IPosition> {
    throw new Error(`Not implemented ${positionId}`)
  }

  private getContractDef<K extends AaveV2ContractNames>(contractName: K): AaveV2AddressAbiMap[K] {
    // TODO: Need to be driven by ChainId in future
    const map: AaveV2AddressAbiMap = {
      Oracle: {
        address: '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9',
        abi: AAVEV2_ORACLE_ABI,
      },
      PoolDataProvider: {
        address: '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d',
        abi: AAVEV2_POOL_DATA_PROVIDER_ABI,
      },
      AaveLendingPool: {
        address: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
        abi: AAVEV2_LENDING_POOL_ABI,
      },
      AaveWethGateway: {
        address: '0x',
        abi: null,
      },
    }

    return map[contractName]
  }

  private async buildAssetsList() {
    try {
      const _ctx = {
        ...this.ctx,
        getContractDef: this.getContractDef,
      }
      const builder = await new AaveLikeProtocolDataBuilder(_ctx, this.protocolName).init()
      return await builder
          .addPrices()
          .addReservesCaps()
          .addReservesConfigData()
          .addReservesData()
          .addEmodeCategories()
          .build()

    } catch (e) {
      throw new Error(`Could not fetch/build assets list for AaveV2: ${JSON.stringify(e)}`)
    }
  }

  private getCollateralAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: Token | CurrencySymbol,
  ): AaveV2CollateralConfig {
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
          type: RiskRatio.type.LTV,
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({
            value: new BigNumber(liquidationThreshold.toString())
                .div(LTV_TO_PERCENTAGE_DIVISOR)
                .toNumber(),
          }),
          type: RiskRatio.type.LTV,
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

  private getDebtAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: CurrencySymbol | Token,
  ): Maybe<AaveV2DebtConfig> {
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
