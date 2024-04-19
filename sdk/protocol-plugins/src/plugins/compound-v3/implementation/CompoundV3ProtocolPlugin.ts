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
  AddressValue,
  Address,
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
import { CompoundV3AddressAbiMap } from '../types/CompoundV3AddressAbiMap'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { COMET_ABI } from '../abis/CompoundV3ABIS'
import { CompoundV3ContractNames } from '@summerfi/deployment-types'
import { CompoundV3PoolId } from '../types/CompoundV3PoolId'
// import { COMPOUND_V3_COLLATERAL_TOKENS } from '../enums/CollateralToken'
// import { COMPOUND_V3_DEBT_TOKENS } from '../enums/DebtToken'
import { IUser } from '@summerfi/sdk-common/user'
import {
  ExternalPositionType,
  IExternalPosition,
  TransactionInfo,
} from '@summerfi/sdk-common/orders/interfaces'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { encodeERC20Transfer } from '../../common/helpers/ERC20Transfer'
import { SimulationSteps } from '@summerfi/sdk-common/simulation'
import { CompoundV3PaybackWithdrawActionBuilder } from '../builders'
import { CompoundV3ImportPositionActionBuilder } from '../builders/CompoundV3ImportPositionActionBuilder'

// type AssetsList = ReturnType<CompoundV3ProtocolPlugin['buildAssetsList']>
// type Asset = Awaited<AssetsList> extends (infer U)[] ? U : never

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

    const { deployments } = this.ctx
    const deploymentKey = this._getDeploymentKey(params.user.chainInfo)
    const deployment = deployments[deploymentKey]

    const erc20ProxyActionsAddress = '0xd48573cda0fed7144f2455c5270ffa16be389d04' /* deployment.dependencies[this.Erc20ProxyActionsContractName]
      .address as AddressValue */

    const sourceAddress =
      params.externalPosition.externalId.type === ExternalPositionType.WALLET
        ? params.user.wallet.address.value
        : erc20ProxyActionsAddress

    const result = encodeERC20Transfer({
      tokenAddress: params.externalPosition.position.pool.poolId.comet.value,
      transferTo: params.positionsManager.address.value,
      transferAmount: TokenAmount.createFromBaseUnit({
        token: Token.createFrom({
          address: params.externalPosition.position.pool.poolId.comet,
          symbol: 'COMET',
          name: 'COMET',
          decimals: 6,
          chainInfo: params.user.chainInfo,
        }),
        amount: '0',
      }),
      source: params.externalPosition.externalId.type,
      sourceAddress: sourceAddress,
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

  // validateCollateralTokens(collaterals: TokenSymbol[]): void {
  //   collaterals.forEach((collateral) => {
  //     // @ts-ignore - TODO: Fix this
  //     if (!COMPOUND_V3_COLLATERAL_TOKENS.includes(collateral)) {
  //       throw new Error(`Invalid collateral token: ${collateral}`)
  //     }
  //   })
  // }
  // validateDebtTokens(debts: TokenSymbol[]): void {
  //   debts.forEach((debt) => {
  //     // @ts-ignore - TODO: Fix this
  //     if (!COMPOUND_V3_DEBT_TOKENS.includes(debt)) {
  //       throw new Error(`Invalid debt token: ${debt}`)
  //     }
  //   })
  // }

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
      debts: [poolDetails.debt],
    })

    // Both USDC & DAI use fixed price oracles that keep both stable at 1 USD
    const poolBaseCurrencyToken = CurrencySymbol.USD

    const collaterals = assetsList.collaterals.reduce<CompoundV3CollateralConfigRecord>(
      (colls, asset) => {
        console.log(asset, colls)
        const assetInfo = this.getCollateralAssetInfo(asset, poolBaseCurrencyToken)
        const collateralToken = asset
        colls[collateralToken.address.value] = assetInfo
        return colls
      },
      {},
    )

    const debts = assetsList.debts.reduce<CompoundV3DebtConfigRecord>((debts, asset) => {
      const assetInfo = this.getDebtAssetInfo(asset, poolBaseCurrencyToken)
      if (!assetInfo) return debts
      const quoteToken = asset
      debts[quoteToken.address.value] = assetInfo
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

  // readonly type: PositionType
  // readonly positionId: PositionId
  // readonly debtAmount: ITokenAmount
  // readonly collateralAmount: ITokenAmount
  // readonly pool: IPool

  async getPosition(positionId: string): Promise<IPosition> {
    throw new Error(`Not implemented ${positionId}`)
  }

  private getContractDef<K extends CompoundV3ContractNames>(
    contractName: K,
  ): CompoundV3AddressAbiMap[K] {
    // TODO: Need to be driven by ChainId in future
    const map: CompoundV3AddressAbiMap = {
      Comet: {
        address: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
        abi: COMET_ABI,
      },
    }

    return map[contractName]
  }

  private async buildAssetsList({
    collaterals,
    debts,
  }: {
    collaterals: TokenSymbol[]
    debts: TokenSymbol[]
  }) {
    try {
      return {
        debts: await Promise.all(
          debts.map(async (debt) => {
            return await this.ctx.tokenService.getTokenBySymbol(debt)
          }),
        ),
        collaterals: await Promise.all(
          collaterals.map(async (collateral) => {
            return await this.ctx.tokenService.getTokenBySymbol(collateral)
          }),
        ),
      }
    } catch (e) {
      throw new Error(`Could not fetch/build assets list for CompoundV3: ${JSON.stringify(e)}`)
    }
  }

  private getCollateralAssetInfo(
    asset: Token,
    poolBaseCurrencyToken: Token | CurrencySymbol,
  ): CompoundV3CollateralConfig {
    // const {
    //   // TODO: Implement
    // } = asset

    return {
      token: asset,
      price: Price.createFrom({
        baseToken: asset,
        quoteToken: poolBaseCurrencyToken,
        value: '0',
      }),
      priceUSD: Price.createFrom({
        baseToken: asset,
        quoteToken: CurrencySymbol.USD,
        value: '0',
      }),
      liquidationThreshold: RiskRatio.createFrom({
        ratio: Percentage.createFrom({
          value: 1,
        }),
        type: RiskRatio.type.LTV,
      }),
      tokensLocked: TokenAmount.createFromBaseUnit({
        token: asset,
        amount: '0',
      }),
      maxSupply: TokenAmount.createFrom({
        token: asset,
        amount: '0',
      }),
      liquidationPenalty: Percentage.createFrom({
        value: 0,
      }),
    }
    // } catch (e) {
    //   throw new Error(`error in collateral loop ${e}`)
    // }
  }

  private getDebtAssetInfo(
    asset: Token,
    poolBaseCurrencyToken: CurrencySymbol | Token,
  ): Maybe<CompoundV3DebtConfig> {
    // const {
    //   // TODO: Implement
    // } = asset
    //     const comet = this.getContractDef('Comet')
    //     const contractCalls = [
    //       {
    //         abi: comet.abi,
    //         address: comet.address,
    //         functionName: 'getPrice',
    //         // pass chainlink oracle address
    //         args: ['0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6'],
    //       },
    //       {
    //         abi: comet.abi,
    //         address: comet.address,
    //         functionName: 'getUtilization',
    //         args: []
    //       },
    //     ] as const
    // // using utilization calcualte borrow rate :
    // const contractCalls2 = [
    //   {
    //     abi: comet.abi,
    //     address: comet.address,
    //     functionName: 'getBorrowRate',
    //     args: [/* TODO: utlization from first call */]
    //   },
    // ] as const
    // this.ctx.provider
    //   .multicall({
    //     contracts: contractCalls,
    //     allowFailure: false,
    //   })
    //   .then((price) => console.log('price', price[0].toString()))
    try {
      return {
        token: asset,
        price: Price.createFrom({
          baseToken: asset,
          quoteToken: poolBaseCurrencyToken,
          value: '0',
        }),
        priceUSD: Price.createFrom({
          baseToken: asset,
          quoteToken: CurrencySymbol.USD,
          value: '0',
        }),
        rate: Percentage.createFrom({ value: 0 }),
        totalBorrowed: TokenAmount.createFromBaseUnit({
          token: asset,
          amount: '0',
        }),
        debtCeiling: TokenAmount.createFrom({
          token: asset,
          amount: '0',
        }),
        debtAvailable: TokenAmount.createFromBaseUnit({
          token: asset,
          amount: '0',
        }),
        dustLimit: TokenAmount.createFromBaseUnit({ token: asset, amount: '0' }),
        originationFee: Percentage.createFrom({
          value: Number('0'),
        }),
      }
    } catch (e) {
      throw new Error(`error in debt loop ${e}`)
    }
  }
}
