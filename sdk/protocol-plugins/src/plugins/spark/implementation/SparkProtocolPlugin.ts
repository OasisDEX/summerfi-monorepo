import {
  Position,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
  IPositionIdData,
} from '@summerfi/sdk-common/common'
import { ILendingPoolIdData, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SparkLendingPool } from './SparkLendingPool'

import { SparkContractNames } from '@summerfi/deployment-types'
import { ActionBuildersMap, IProtocolPluginContext } from '@summerfi/protocol-plugins-common'
import { SparkAbiMap, SparkAbiMapType } from '../abis/SparkAddressAbiMap'
import { IUser } from '@summerfi/sdk-common/user'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  isSparkLendingPoolId,
} from '../interfaces/ISparkLendingPoolId'
import { SparkStepBuilders } from '../builders/SparkStepBuilders'
import { ISparkPositionIdData, isSparkPositionId } from '../interfaces'
import { IAaveV3PositionIdData } from '../../aave-v3'
import { SparkLendingPoolInfo } from './SparkLendingPoolInfo'
import { sparkEmodeCategoryMap } from './EmodeCategoryMap'
import { AAVEv3LikeBaseProtocolPlugin } from '../../common/helpers/aaveV3Like/AAVEv3LikeBaseProtocolPlugin'
import { FiatCurrency, IChainInfo } from '@summerfi/sdk-common'
import { ContractInfo } from '../../common/types/ContractInfo'
import { ChainContractsProvider } from '../../utils/ChainContractProvider'

/**
 * @class SparkProtocolPlugin
 * @description Protocol plugin for the Spark protocol
 * @see BaseProtocolPlugin
 */
export class SparkProtocolPlugin extends AAVEv3LikeBaseProtocolPlugin<
  SparkContractNames,
  SparkAbiMapType
> {
  readonly protocolName: ProtocolName.Spark = ProtocolName.Spark
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = SparkStepBuilders

  initialize(params: { context: IProtocolPluginContext }) {
    const contractsAbiProvider = new ChainContractsProvider(SparkAbiMap)

    super.initialize({
      ...params,
      contractsAbiProvider,
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
      collateralToken: poolId.collateralToken,
      debtToken: poolId.debtToken,
    })
  }

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  protected async _getLendingPoolInfoImpl(
    sparkPoolId: ISparkLendingPoolId,
  ): Promise<SparkLendingPoolInfo> {
    await this._inititalizeAssetsListIfNeeded({ chainInfo: sparkPoolId.protocol.chainInfo })

    const emode = sparkEmodeCategoryMap[sparkPoolId.emodeType]

    const collateralInfo = await this._getCollateralInfo({
      token: sparkPoolId.collateralToken,
      emode: emode,
      poolBaseCurrencyToken: FiatCurrency.USD,
    })
    if (!collateralInfo) {
      throw new Error(`Collateral info not found for ${sparkPoolId.collateralToken}`)
    }

    const debtInfo = await this._getDebtInfo(sparkPoolId.debtToken, emode, FiatCurrency.USD)
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
  protected async _getContractDef(params: {
    chainInfo: IChainInfo
    contractName: SparkContractNames
  }): Promise<ContractInfo> {
    const contractAddress = await this._getContractAddress(params)

    return {
      address: contractAddress.value,
      abi: this.contractsAbiProvider.getContractAbi(params.contractName),
    }
  }
}
