import {
  CurrencySymbol,
  Position,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
  IPositionIdData,
} from '@summerfi/sdk-common/common'
import { ILendingPoolIdData, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { SparkLendingPool } from './SparkLendingPool'

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
import { AAVEv3BaseProtocolPlugin } from '../../common/helpers/aaveV3Like/AAVEv3LikeBaseProtocolPlugin'
import { AAVEv3LikeAbiInfo } from '../../common/helpers/aaveV3Like/AAVEv3LikeAbi'

/**
 * @class SparkProtocolPlugin
 * @description Protocol plugin for the Spark protocol
 * @see BaseProtocolPlugin
 */
export class SparkProtocolPlugin extends AAVEv3BaseProtocolPlugin {
  readonly protocolName: ProtocolName.Spark = ProtocolName.Spark
  readonly supportedChains = valuesOfChainFamilyMap([ChainFamilyName.Ethereum])
  readonly stepBuilders: Partial<ActionBuildersMap> = SparkStepBuilders

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

  /** @see BaseProtocolPlugin._getLendingPoolInfoImpl */
  protected async _getLendingPoolInfoImpl(
    sparkPoolId: ISparkLendingPoolId,
  ): Promise<SparkLendingPoolInfo> {
    this._inititalizeAssetsListIfNeeded()

    const emode = sparkEmodeCategoryMap[sparkPoolId.emodeType]

    const collateralInfo = await this._getCollateralInfo({
      token: sparkPoolId.collateralToken,
      emode: emode,
      poolBaseCurrencyToken: CurrencySymbol.USD,
    })
    if (!collateralInfo) {
      throw new Error(`Collateral info not found for ${sparkPoolId.collateralToken}`)
    }

    const debtInfo = await this._getDebtInfo(sparkPoolId.debtToken, emode, CurrencySymbol.USD)
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
  protected _getContractDef(contractName: SparkContractNames): AAVEv3LikeAbiInfo {
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
}
