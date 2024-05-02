import {
  CurrencySymbol,
  ChainFamilyName,
  valuesOfChainFamilyMap,
  Maybe,
  IPosition,
  IPositionId,
  IPositionIdData,
} from '@summerfi/sdk-common/common'
import { ILendingPoolIdData, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
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
import { AaveV3LendingPoolInfo } from './AaveV3LendingPoolInfo'
import { aaveV3EmodeCategoryMap } from './EmodeCategoryMap'
import { AAVEv3BaseProtocolPlugin } from '../../common/helpers/aaveV3Like/AAVEv3LikeBaseProtocolPlugin'
import { AAVEv3LikeAbiInfo } from '../../common/helpers/aaveV3Like/AAVEv3LikeAbi'

/**
 * @class AaveV3ProtocolPlugin
 * @description Aave V3 protocol plugin
 * @see BaseProtocolPlugin
 */
export class AaveV3ProtocolPlugin extends AAVEv3BaseProtocolPlugin {
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
    await this._inititalizeAssetsListIfNeeded()

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

  protected _getContractDef(contractName: AaveV3ContractNames): AAVEv3LikeAbiInfo {
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
}
