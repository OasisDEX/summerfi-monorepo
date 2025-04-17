import { AaveV3ContractNames } from '@summerfi/deployment-types'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import {
  FiatCurrency,
  ChainFamilyName,
  IChainInfo,
  IPositionIdData,
  Maybe,
  ProtocolName,
  valuesOfChainFamilyMap,
  ILendingPoolIdData,
  ILendingPosition,
  ILendingPositionId,
  IExternalLendingPosition,
  IPositionsManager,
  TransactionInfo,
  IUser,
} from '@summerfi/sdk-common'
import { AAVEv3LikeBaseProtocolPlugin } from '../../common/helpers/aaveV3Like/AAVEv3LikeBaseProtocolPlugin'
import { ContractInfo } from '../../common/types/ContractInfo'
import { ChainContractsProvider } from '../../utils/ChainContractProvider'
import { AaveV3AbiMap, AaveV3AbiMapType } from '../abis/AaveV3AddressAbiMap'
import { AaveV3StepBuilders } from '../builders/AaveV3StepBuilders'
import {
  IAaveV3LendingPoolId,
  IAaveV3LendingPoolIdData,
  isAaveV3LendingPoolId,
} from '../interfaces/IAaveV3LendingPoolId'
import {
  IAaveV3LendingPositionIdData,
  isAaveV3LendingPositionId,
} from '../interfaces/IAaveV3LendingPositionId'
import { AaveV3LendingPool } from './AaveV3LendingPool'
import { AaveV3LendingPoolInfo } from './AaveV3LendingPoolInfo'
import { aaveV3EmodeCategoryMap } from './EmodeCategoryMap'

/**
 * @class AaveV3ProtocolPlugin
 * @description Aave V3 protocol plugin
 * @see BaseProtocolPlugin
 */
export class AaveV3ProtocolPlugin extends AAVEv3LikeBaseProtocolPlugin<
  AaveV3ContractNames,
  AaveV3AbiMapType
> {
  readonly protocolName = ProtocolName.AaveV3
  readonly supportedChains = valuesOfChainFamilyMap([
    ChainFamilyName.Ethereum,
    ChainFamilyName.Base,
    ChainFamilyName.Arbitrum,
    ChainFamilyName.Optimism,
  ])
  readonly stepBuilders: Partial<ActionBuildersMap> = AaveV3StepBuilders

  initialize(params: { context: IProtocolPluginContext }) {
    const contractsAbiProvider = new ChainContractsProvider(AaveV3AbiMap)

    super.initialize({
      ...params,
      contractsAbiProvider,
      dataProviderContractName: 'PoolDataProvider',
      oracleContractName: 'Oracle',
    })

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
  protected _validateLendingPositionId(
    candidate: IPositionIdData,
  ): asserts candidate is IAaveV3LendingPositionIdData {
    if (!isAaveV3LendingPositionId(candidate)) {
      throw new Error(`Invalid AaveV3 position ID: ${JSON.stringify(candidate)}`)
    }
  }

  /** LENDING POOLS */

  /** @see BaseProtocolPlugin._getLendingPoolImpl */
  async _getLendingPoolImpl(aaveV3PoolId: IAaveV3LendingPoolId): Promise<AaveV3LendingPool> {
    return AaveV3LendingPool.createFrom({
      id: aaveV3PoolId,
      collateralToken: aaveV3PoolId.collateralToken,
      debtToken: aaveV3PoolId.debtToken,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  async _getLendingPoolInfoImpl(
    aaveV3PoolId: IAaveV3LendingPoolId,
  ): Promise<AaveV3LendingPoolInfo> {
    await this._inititalizeAssetsListIfNeeded({ chainInfo: aaveV3PoolId.protocol.chainInfo })

    const emode = aaveV3EmodeCategoryMap[aaveV3PoolId.emodeType]

    const [collateralInfo, debtInfo] = await Promise.all([
      this._getCollateralInfo({
        token: aaveV3PoolId.collateralToken,
        emode: emode,
        poolBaseCurrencyToken: FiatCurrency.USD,
      }),
      this._getDebtInfo(aaveV3PoolId.debtToken, emode, FiatCurrency.USD),
    ])

    if (!collateralInfo) {
      throw new Error(`Collateral info not found for ${aaveV3PoolId.collateralToken}`)
    }
    if (!debtInfo) {
      throw new Error(`Debt info not found for ${aaveV3PoolId.debtToken}`)
    }

    return AaveV3LendingPoolInfo.createFrom({
      id: aaveV3PoolId,
      collateral: collateralInfo,
      debt: debtInfo,
    })
  }

  /** POSITIONS */

  /** @see BaseProtocolPlugin.getPosition */
  async getLendingPosition(positionId: ILendingPositionId): Promise<ILendingPosition> {
    throw new Error(`Not implemented ${positionId}`)
  }

  /** IMPORT TRANSACTIONS */

  /** @see BaseProtocolPlugin.getImportPositionTransaction */
  async getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>> {
    throw new Error(`Not implemented ${params}`)
  }

  /** PRIVATE */

  protected async _getContractDef(params: {
    chainInfo: IChainInfo
    contractName: AaveV3ContractNames
  }): Promise<ContractInfo> {
    const contractAddress = await this._getContractAddress(params)

    return {
      address: contractAddress.value,
      abi: AaveV3AbiMap[params.contractName],
    }
  }
}
