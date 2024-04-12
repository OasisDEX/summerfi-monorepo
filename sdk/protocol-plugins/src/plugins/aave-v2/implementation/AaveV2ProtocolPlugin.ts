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
import { BaseProtocolPlugin } from '../../../implementation/BaseProtocolPlugin'

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
import { AAVEV2_PLACHOLDER_ABI } from '../abis/AaveV2ABIS'
import { AaveV2ContractNames } from '@summerfi/deployment-types'
import { AaveV2PoolId } from '../types/AaveV2PoolId'

export class AaveV2ProtocolPlugin extends BaseProtocolPlugin {
  readonly protocolName = ProtocolName.AaveV2
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = {}

  readonly aaveV2PoolidSchema = z.object({
    protocol: z.object({
      name: z.literal(ProtocolName.AaveV2),
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
        address: '0xPlaceholder',
        abi: AAVEV2_PLACHOLDER_ABI,
      },
    }

    return map[contractName]
  }

  private async buildAssetsList() {
    try {
      // TODO: Implement
      return []
    } catch (e) {
      throw new Error(`Could not fetch/build assets list for AaveV2: ${JSON.stringify(e)}`)
    }
  }

  private getCollateralAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: Token | CurrencySymbol,
  ): AaveV2CollateralConfig {
    const {
      // TODO: Implement
    } = asset

    try {
      return {}
    } catch (e) {
      throw new Error(`error in collateral loop ${e}`)
    }
  }

  private getDebtAssetInfo(
    asset: Asset,
    poolBaseCurrencyToken: CurrencySymbol | Token,
  ): Maybe<AaveV2DebtConfig> {
    const {
      // TODO: Implement
    } = asset

    try {
      return {}
    } catch (e) {
      throw new Error(`error in debt loop ${e}`)
    }
  }
}
