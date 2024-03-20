import {
  Position,
  AddressValue,
  Percentage,
  TokenAmount,
  TokenSymbol,
  Price,
  CurrencySymbol,
  RiskRatio,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  ChainId,
} from '@summerfi/sdk-common/common'
import type { AaveV3PoolId } from '@summerfi/sdk-common/protocols'
import { PoolType, ProtocolName, EmodeType } from '@summerfi/sdk-common/protocols'
import { BigNumber } from 'bignumber.js'
import { z } from 'zod'
import { BaseProtocolPlugin } from '../implementation/BaseProtocolPlugin'
import {aaveV3EmodeCategoryMap} from "./emodeCategoryMap";
import { AaveV3LendingPool, AaveV3PoolCollateralConfig, AaveV3PoolDebtConfig } from './Types'
import {
  AaveV3LikePluginBuilder,
  filterAssetsListByEMode,
} from '../implementation/AAVEv3LikeBuilder'
import { UNCAPPED_SUPPLY, PRECISION_BI } from '../implementation/constants'

export class AaveV3ProtocolPlugin extends BaseProtocolPlugin<AaveV3PoolId> {
  public static protocol: ProtocolName.AAVEv3 = ProtocolName.AAVEv3
  public static supportedChains = valuesOfChainFamilyMap([
    ChainFamilyName.Ethereum,
    ChainFamilyName.Base,
    ChainFamilyName.Arbitrum,
    ChainFamilyName.Optimism,
  ])
  public static schema = z.object({
    protocol: z.object({
      name: z.literal(ProtocolName.AAVEv3),
      chainInfo: z.object({
        name: z.string(),
        chainId: z.custom<ChainId>(
          (chainId) =>
            AaveV3ProtocolPlugin.supportedChains.some((chainInfo) => chainInfo.chainId === chainId),
          'Chain ID not supported',
        ),
      }),
    }),
    emodeType: z.nativeEnum(EmodeType),
  })

  constructor() {
    const StepBuildersMap = {}
    super(
      AaveV3ProtocolPlugin.protocol,
      AaveV3ProtocolPlugin.supportedChains,
      AaveV3ProtocolPlugin.schema,
      StepBuildersMap,
    )
  }

  async getPool(aaveV3PoolId: unknown): Promise<AaveV3LendingPool> {
    this.isPoolId(aaveV3PoolId)
    const emode = aaveV3EmodeCategoryMap[aaveV3PoolId.emodeType]

    const ctx = this.ctx
    const chainId = ctx.provider.chain?.id
    if (!chainId) throw new Error('ctx.provider.chain.id undefined')

    if (!AaveV3ProtocolPlugin.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }

    const builder = await new AaveV3LikePluginBuilder(ctx, aaveV3PoolId.protocol.name).init()
    const reservesAssetsList = await builder
      .addPrices()
      .addReservesCaps()
      .addReservesConfigData()
      .addReservesData()
      .addEmodeCategories()
      .build()

    const filteredAssetsList = filterAssetsListByEMode(reservesAssetsList, emode)

    // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
    const poolBaseCurrencyToken = CurrencySymbol.USD

    const collaterals: Record<AddressValue, AaveV3PoolCollateralConfig> = {}
    for (const asset of filteredAssetsList) {
      const {
        token: collateralToken,
        config: { usageAsCollateralEnabled, ltv, liquidationThreshold, liquidationBonus },
        caps: { supplyCap },
        data: { totalAToken },
      } = asset

      const LTV_TO_PERCENTAGE_DIVISOR = new BigNumber(100)

      try {
        collaterals[collateralToken.address.value] = {
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
              percentage: new BigNumber(ltv.toString()).div(LTV_TO_PERCENTAGE_DIVISOR).toNumber(),
            }),
            type: RiskRatio.type.LTV,
          }),
          liquidationThreshold: RiskRatio.createFrom({
            ratio: Percentage.createFrom({
              percentage: new BigNumber(liquidationThreshold.toString())
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
            percentage: new BigNumber(liquidationBonus.toString())
              .div(LTV_TO_PERCENTAGE_DIVISOR)
              .toNumber(),
          }),
          apy: Percentage.createFrom({ percentage: 0 }),
          usageAsCollateralEnabled,
        }
      } catch (e) {
        console.log('error in collateral loop', e)
        throw new Error(`error in collateral loop ${e}`)
      }
    }

    const debts: Record<AddressValue, AaveV3PoolDebtConfig> = {}
    for (const asset of filteredAssetsList) {
      const {
        token: quoteToken,
        config: { borrowingEnabled, reserveFactor },
        caps: { borrowCap },
        data: { totalVariableDebt, totalStableDebt, variableBorrowRate },
      } = asset
      if (quoteToken.symbol === TokenSymbol.WETH) {
        // WETH can be used as collateral on AaveV3 but not borrowed.
        continue
      }

      try {
        const RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR = 10000n
        const PRECISION_PRESERVING_OFFSET = 1000000n
        const RATE_DIVISOR_TO_GET_PERCENTAGE = Number(
          (PRECISION_PRESERVING_OFFSET - 100n).toString(),
        )

        const rate =
          Number(
            ((variableBorrowRate * PRECISION_PRESERVING_OFFSET) / PRECISION_BI.RAY).toString(),
          ) / RATE_DIVISOR_TO_GET_PERCENTAGE
        const totalBorrowed = totalVariableDebt + totalStableDebt
        debts[quoteToken.address.value] = {
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
          rate: Percentage.createFrom({ percentage: rate }),
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
            percentage: Number((reserveFactor / RESERVE_FACTOR_TO_PERCENTAGE_DIVISOR).toString()),
          }),
          borrowingEnabled,
        }
      } catch (e) {
        console.log('error in debt loop', e)
        throw new Error(`error in debt loop ${e}`)
      }
    }

    return {
      type: PoolType.Lending,
      poolId: aaveV3PoolId,
      protocol: aaveV3PoolId.protocol,
      baseCurrency: CurrencySymbol.USD,
      collaterals,
      debts,
    }
  }

  async getPosition(positionId: string): Promise<Position> {
    throw new Error(`Not implemented ${positionId}`)
  }
}

export const aaveV3ProtocolPlugin = new AaveV3ProtocolPlugin()
