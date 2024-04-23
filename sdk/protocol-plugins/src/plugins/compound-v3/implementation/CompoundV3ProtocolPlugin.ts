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
  Address,
  AddressValue,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'

import { CompoundV3LendingPool } from './CompoundV3LendingPool'
import { CompoundV3CollateralConfig } from './CompoundV3CollateralConfig'
import { CompoundV3DebtConfig } from './CompoundV3DebtConfig'
import {
  CompoundV3CollateralConfigMap,
  CompoundV3CollateralConfigRecord,
} from './CompoundV3CollateralConfigMap'
import { CompoundV3DebtConfigMap, CompoundV3DebtConfigRecord } from './CompoundV3DebtConfigMap'
import { z } from 'zod'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { CompoundV3PoolId } from '../types/CompoundV3PoolId'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, TransactionInfo } from '@summerfi/sdk-common/orders/interfaces'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { CompoundV3PaybackWithdrawActionBuilder } from '../builders'
import { CompoundV3ImportPositionActionBuilder } from '../builders/CompoundV3ImportPositionActionBuilder'
import { encodeCompoundV3Allow } from '../../common/helpers/CompoundV3Approval'
import { BigNumber } from 'bignumber.js'
import { cometAbi } from '../abis/CompoundV3ABIS'

type DebtAsset = {
  token: Token
  totalSupplyBase: bigint
  totalBorrowBase: bigint
  utilization: bigint
  priceFeed: AddressValue
  borrowRate: bigint
  price: bigint
  priceUSD: bigint
}

type CollateralAsset = {
  token: Token
  liquidationFactor: bigint
  priceFeed: AddressValue
  tokensLocked: bigint
  liquidateCollateralFactor: bigint
  supplyCap: bigint
  price: bigint
  scale: bigint
  priceUSD: bigint
}

export class CompoundV3ProtocolPlugin extends BaseProtocolPlugin {
  readonly Erc20ProxyActionsContractName = 'DssErc20ProxyActions'

  readonly protocolName = ProtocolName.CompoundV3
  readonly supportedChains = valuesOfChainFamilyMap([
    ChainFamilyName.Ethereum,
    ChainFamilyName.Base,
    ChainFamilyName.Optimism,
    ChainFamilyName.Arbitrum,
  ])
  readonly stepBuilders: Partial<ActionBuildersMap> = {
    [SimulationSteps.PaybackWithdraw]: CompoundV3PaybackWithdrawActionBuilder,
    [SimulationSteps.Import]: CompoundV3ImportPositionActionBuilder,
  }

  readonly compoundV3PoolidSchema = z.object({
    protocol: z.object({
      name: z.literal(ProtocolName.CompoundV3),
      chainInfo: z.object({
        name: z.string(),
        chainId: z.custom<ChainId>(
          (chainId) => this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId),
          'Chain ID not supported',
        ),
      }),
    }),
    collaterals: z.array(z.string()),
    debt: z.string(),
    comet: z.custom<Address>(
      (address: unknown) => address instanceof Address && Address.isValid(address.value),
      'Invalid address',
    ),
  })

  constructor(params: { context: IProtocolPluginContext }) {
    super(params)
  }
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    this.validatePoolId(params.externalPosition.position.pool.poolId)

    const externalPositionAddress = params.externalPosition.externalId.address.value

    const result = encodeCompoundV3Allow({
      positionsManager: params.positionsManager.address.value,
      comet: params.externalPosition.position.pool.poolId.comet.value,
      source: params.externalPosition.externalId.type,
      sourceAddress: externalPositionAddress,
    })
    return {
      description: 'Import Compound V3 position',
      transaction: {
        calldata: result.calldata,
        target: result.target,
        value: '0',
      },
    }
  }

  isPoolId(candidate: unknown): candidate is CompoundV3PoolId {
    return this._isPoolId(candidate, this.compoundV3PoolidSchema)
  }

  validatePoolId(candidate: unknown): asserts candidate is CompoundV3PoolId {
    if (!this.isPoolId(candidate)) {
      throw new Error(`Invalid CompoundV3 pool ID: ${JSON.stringify(candidate)}`)
    }
  }

  async getPool(compoundV3PoolId: unknown): Promise<CompoundV3LendingPool> {
    this.validatePoolId(compoundV3PoolId)
    const poolDetails = compoundV3PoolId

    const ctx = this.ctx

    const chainId = ctx.provider.chain?.id
    if (!chainId) throw new Error('ctx.provider.chain.id undefined')

    if (!this.supportedChains.some((chainInfo) => chainInfo.chainId === chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported`)
    }

    const assetsList = await this.buildAssetsList({
      collaterals: poolDetails.collaterals,
      debt: poolDetails.debt,
      comet: poolDetails.comet.value,
    })

    // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
    // todo: there are two options - on each blockchain you have a USD market an USDC market
    // it can be read from the comet contract - getBaseToken

    const poolBaseCurrencyToken = CurrencySymbol.USD

    const collaterals = assetsList.collaterals.reduce<CompoundV3CollateralConfigRecord>(
      (colls, asset) => {
        const assetInfo = this.getCollateralAssetInfo(asset, poolBaseCurrencyToken)
        const collateralToken = asset
        colls[collateralToken.token.address.value] = assetInfo
        return colls
      },
      {},
    )

    const debts = assetsList.debts.reduce<CompoundV3DebtConfigRecord>((debts, asset) => {
      const assetInfo = this.getDebtAssetInfo(asset, poolBaseCurrencyToken)
      if (!assetInfo) return debts
      const quoteToken = asset
      debts[quoteToken.token.address.value] = assetInfo
      return debts
    }, {})

    return CompoundV3LendingPool.createFrom({
      type: PoolType.Lending,
      poolId: compoundV3PoolId,
      protocol: compoundV3PoolId.protocol,
      baseCurrency: CurrencySymbol.USD,
      collaterals: CompoundV3CollateralConfigMap.createFrom({ record: collaterals }),
      debts: CompoundV3DebtConfigMap.createFrom({ record: debts }),
    })
  }

  async getPosition(positionId: string): Promise<IPosition> {
    throw new Error(`Not implemented ${positionId}`)
  }

  // private getContractDef<K extends CompoundV3ContractNames>(
  //   contractName: K,
  // ): CompoundV3AddressAbiMap[K] {
  //   // TODO: Need to be driven by ChainId in future
  //   const map: CompoundV3AddressAbiMap = {}

  //   return map[contractName]
  // }

  private async buildAssetsList({
    collaterals,
    debt,
    comet,
  }: {
    collaterals: TokenSymbol[]
    debt: TokenSymbol
    comet: AddressValue
  }): Promise<{ debts: DebtAsset[]; collaterals: CollateralAsset[] }> {
    try {
      const cometContract = {
        address: comet,
        abi: cometAbi,
      } as const
      const collteralAssets: Record<string, CollateralAsset> = {}

      await Promise.all(
        collaterals.map(async (collateral) => {
          const collateralTokenAddress = await this.ctx.tokenService.getTokenBySymbol(collateral)

          const collateralCalls = [
            {
              ...cometContract,
              functionName: 'getAssetInfoByAddress' as const,
              args: [collateralTokenAddress.address.value],
            },

            {
              ...cometContract,
              functionName: 'totalsCollateral' as const,
              args: [collateralTokenAddress.address.value],
            },
          ] as const

          const [assetInfoData, totalsCollateralData] = await this.ctx.provider.multicall({
            contracts: collateralCalls,
            allowFailure: true,
          })

          const priceFeed =
            assetInfoData.status === 'success' ? assetInfoData.result.priceFeed : '0x00'
          const liquidationFactor =
            assetInfoData.status === 'success' ? assetInfoData.result.liquidationFactor : 0n
          const tokensLocked =
            totalsCollateralData.status === 'success' ? totalsCollateralData.result[0] : 0n
          const liquidateCollateralFactor =
            assetInfoData.status === 'success' ? assetInfoData.result.liquidateCollateralFactor : 0n
          const supplyCap = assetInfoData.status === 'success' ? assetInfoData.result.supplyCap : 0n
          const scale = assetInfoData.status === 'success' ? assetInfoData.result.scale : 0n
          collteralAssets[collateralTokenAddress.address.value] = {
            token: collateralTokenAddress,
            liquidationFactor: liquidationFactor,
            priceFeed: priceFeed as AddressValue,
            tokensLocked,
            liquidateCollateralFactor,
            supplyCap,
            scale,
            price: 0n,
            priceUSD: 0n,
          }
        }),
      )

      const debtAddress = await this.ctx.tokenService.getTokenBySymbol(debt)
      const debtCalls = [
        {
          address: comet,
          abi: cometAbi,
          functionName: 'baseTokenPriceFeed' as const,
          args: [],
        },
        {
          address: comet,
          abi: cometAbi,
          functionName: 'totalsBasic' as const,
          args: [],
        },
        {
          address: comet,
          abi: cometAbi,
          functionName: 'getUtilization' as const,
          args: [],
        },
      ] as const
      const [baseTokenPriceFeedData, totalsBasicData, utilizationData] =
        await this.ctx.provider.multicall({
          contracts: debtCalls,
          allowFailure: true,
        })

      const totalSupplyBase =
        totalsBasicData.status === 'success' ? totalsBasicData.result.totalSupplyBase : 0n
      const totalBorrowBase =
        totalsBasicData.status === 'success' ? totalsBasicData.result.totalBorrowBase : 0n
      const priceFeed =
        baseTokenPriceFeedData.status === 'success' ? baseTokenPriceFeedData.result : '0x00'
      const utilization = utilizationData.status === 'success' ? utilizationData.result : 0n
      const borrowRateCall = [
        {
          address: comet,
          abi: cometAbi,
          functionName: 'getBorrowRate' as const,
          args: [utilization],
        },
      ] as const
      const [borrowRateData] = await this.ctx.provider.multicall({
        contracts: borrowRateCall,
        allowFailure: true,
      })
      const borrowRate = borrowRateData.status === 'success' ? borrowRateData.result : 0n
      const debtAsset = {
        token: debtAddress,
        totalSupplyBase,
        totalBorrowBase,
        utilization: utilization,
        priceFeed,
        borrowRate,
      }
      const callateralPriceCalls = Object.values(collteralAssets).map((collteralAsset) => ({
        ...cometContract,
        functionName: 'getPrice' as const,
        args: [collteralAsset.priceFeed],
      }))
      const debtPriceCall = {
        ...cometContract,
        functionName: 'getPrice' as const,
        args: [debtAsset.priceFeed],
      }

      const priceCalls = [...callateralPriceCalls, debtPriceCall]

      const prices = await this.ctx.provider.multicall({
        contracts: priceCalls,
        allowFailure: false,
      })

      Object.values(collteralAssets).map((collteralAsset, i) => {
        collteralAsset.price = prices[i]
        collteralAsset.priceUSD = prices[i]
      })
      const debtAssetWithPrice = {
        ...debtAsset,
        price: prices[prices.length - 1],
        priceUSD: prices[prices.length - 1],
      }

      return {
        debts: [debtAssetWithPrice],
        collaterals: Object.values(collteralAssets),
      }
    } catch (e) {
      throw new Error(`Could not fetch/build assets list for CompoundV3: ${JSON.stringify(e)}`)
    }
  }

  /**
   * Formats a Chainlink price from a BigInt to a string.
   *
   * @remarks
   * `1e8` is the default Chainlink precision for USD denominated oracles.
   * @todo This should be moved to a common helper. Support 18 decimals for non-USD denominated oracles (e.g. ETH).
   *
   * @param price - The price to format, represented as a BigInt.
   * @returns The formatted price as a string.
   */
  private formatChainlinkPrice(price: bigint): string {
    return new BigNumber(price.toString()).div(new BigNumber('1e8')).toString()
  }

  /**
   * Derives the liquidation penalty from a given value.
   *
   * @remarks
   * From the Compound III documentation: The liquidation factor is an integer that represents the decimal value scaled up by 10 ^ 18.
   * For example, 930000000000000000 means liquidation carries a 7% penalty for the account.
   *
   * @param liquidationFactor - The value to derive the liquidation penalty from, represented as a BigInt.
   * @returns The derived liquidation penalty as a number.
   */
  private deriveLiquidationPenalty(liquidationFactor: bigint): number {
    return new BigNumber('1e18')
      .minus(new BigNumber(liquidationFactor.toString()))
      .multipliedBy(100)
      .div(new BigNumber('1e18'))
      .toNumber()
  }
  /**
   * Formats the liquidation threshold from a BigInt to a number.
   *
   * @remarks
   * From the Compound III documentation: The liquidate collateral factor is the percentage of collateral
   * value that can be borrowed (including interest) before an account becomes liquidatable.
   * The return value is an integer that represents the decimal value scaled up by 10 ^ 18.
   * For example, 850000000000000000 represents 85%.
   *
   * @param liquidateCollateralFactor - The value to format, represented as a BigInt.
   * @returns The formatted liquidation threshold as a number.
   */
  private formatLiquidationThreshold(liquidateCollateralFactor: bigint): number {
    return new BigNumber(liquidateCollateralFactor.toString())
      .multipliedBy(100)
      .div(new BigNumber('1e18'))
      .toNumber()
  }
  /**
   * Formats the supply cap from a BigInt to a string.
   *
   * @remarks
   * From the Compound III documentation: The supply cap of the collateral asset is an integer scaled up
   * by 10 ^ x, where x is the amount of decimal places in the asset’s smart contract.
   *
   * @param supplyCap - The value to format, represented as a BigInt.
   * @param scale - The scale to use for formatting, represented as a BigInt.
   * @returns The formatted supply cap as a string.
   */
  private formatSupplyCap(supplyCap: bigint, scale: bigint): string {
    return new BigNumber(supplyCap.toString()).div(new BigNumber(scale.toString())).toString()
  }
  /**
   * Derives the borrow rate from a given value.
   *
   * @remarks
   * From the Compound III documentation: The borrow rate is an integer that represents the decimal value scaled up by 10 ^ 18.
   * The function converts the borrow rate from a per-block rate to an approximate APR (annual percentage rate), assuming there are approximately 31536000 seconds in a year.
   *
   * @param borrowRate - The value to derive the borrow rate from, represented as a BigInt.
   * @returns The derived borrow rate as a number.
   */
  private deriveBorrowRate(borrowRate: bigint): number {
    return new BigNumber(borrowRate.toString())
      .div(new BigNumber('1e18'))
      .multipliedBy(31536000)
      .multipliedBy(100)
      .toNumber()
  }

  private getCollateralAssetInfo(
    asset: CollateralAsset,
    poolBaseCurrencyToken: Token | CurrencySymbol,
  ): CompoundV3CollateralConfig {
    try {
      return {
        token: asset.token,
        price: Price.createFrom({
          baseToken: asset.token,
          quoteToken: poolBaseCurrencyToken,
          value: this.formatChainlinkPrice(asset.price),
        }),
        priceUSD: Price.createFrom({
          baseToken: asset.token,
          quoteToken: CurrencySymbol.USD,
          value: this.formatChainlinkPrice(asset.price),
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({
            value: this.formatLiquidationThreshold(asset.liquidateCollateralFactor),
          }),
          type: RiskRatio.type.LTV,
        }),
        tokensLocked: TokenAmount.createFromBaseUnit({
          token: asset.token,
          amount: asset.tokensLocked.toString(),
        }),
        maxSupply: TokenAmount.createFrom({
          token: asset.token,
          amount: this.formatSupplyCap(asset.supplyCap, asset.scale),
        }),
        liquidationPenalty: Percentage.createFrom({
          value: this.deriveLiquidationPenalty(asset.liquidationFactor),
        }),
      }
    } catch (e) {
      throw new Error(`error in collateral loop ${e}`)
    }
  }

  private getDebtAssetInfo(
    asset: DebtAsset,
    poolBaseCurrencyToken: CurrencySymbol | Token,
  ): Maybe<CompoundV3DebtConfig> {
    try {
      return {
        token: asset.token,
        price: Price.createFrom({
          baseToken: asset.token,
          quoteToken: poolBaseCurrencyToken,
          value: this.formatChainlinkPrice(asset.price),
        }),
        priceUSD: Price.createFrom({
          baseToken: asset.token,
          quoteToken: CurrencySymbol.USD,
          value: this.formatChainlinkPrice(asset.price),
        }),
        rate: Percentage.createFrom({ value: this.deriveBorrowRate(asset.borrowRate) }),
        totalBorrowed: TokenAmount.createFromBaseUnit({
          token: asset.token,
          amount: asset.totalBorrowBase.toString(),
        }),
        debtCeiling: TokenAmount.createFromBaseUnit({
          token: asset.token,
          amount: asset.totalSupplyBase.toString(),
        }),
        debtAvailable: TokenAmount.createFromBaseUnit({
          token: asset.token,
          amount: (asset.totalSupplyBase - asset.totalBorrowBase).toString(),
        }),
        dustLimit: TokenAmount.createFromBaseUnit({ token: asset.token, amount: '0' }),
        originationFee: Percentage.createFrom({
          value: Number('0'),
        }),
      }
    } catch (e) {
      throw new Error(`error in debt loop ${e}`)
    }
  }
}
