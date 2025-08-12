import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import {
  IArmadaManager,
  type IArmadaManagerClaims,
  type IArmadaManagerGovernance,
  getDeployedRewardsRedeemerAddress,
  type IArmadaManagerMigrations,
  type IArmadaManagerBridge,
  type IArmadaManagerVaults,
  type IArmadaManagerUtils,
  type IArmadaManagerMerklRewards,
  type IArmadaManagerAdmin,
  type IArmadaManagerAccessControl,
} from '@summerfi/armada-protocol-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { getChainInfoByChainId, IAddress, type ChainInfo } from '@summerfi/sdk-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import { ITokensManager } from '@summerfi/tokens-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import { ArmadaManagerClaims } from './ArmadaManagerClaims'
import { ArmadaManagerGovernance } from './ArmadaManagerGovernance'
import { ArmadaManagerMigrations } from './ArmadaManagerMigrations'
import { ArmadaManagerBridge } from './ArmadaManagerBridge'
import { ArmadaManagerVaults } from './ArmadaManagerVaults'
import { ArmadaManagerUtils } from './ArmadaManagerUtils'
import { ArmadaManagerMerklRewards } from './ArmadaManagerMerklRewards'
import { ArmadaManagerAdmin } from './ArmadaManagerAdmin'
import { ArmadaManagerAccessControl } from './ArmadaManagerAccessControl'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManager implements IArmadaManager {
  claims: IArmadaManagerClaims
  governance: IArmadaManagerGovernance
  migrations: IArmadaManagerMigrations
  bridge: IArmadaManagerBridge
  vaults: IArmadaManagerVaults
  utils: IArmadaManagerUtils
  merklRewards: IArmadaManagerMerklRewards
  admin: IArmadaManagerAdmin
  accessControl: IArmadaManagerAccessControl

  private _supportedChains: ChainInfo[]
  private _rewardsRedeemerAddress: IAddress

  private _hubChainInfo: ChainInfo
  private _configProvider: IConfigurationProvider
  private _deploymentProvider: IDeploymentProvider
  private _allowanceManager: IAllowanceManager
  private _contractsProvider: IContractsProvider
  private _subgraphManager: IArmadaSubgraphManager
  private _blockchainClientProvider: IBlockchainClientProvider
  private _swapManager: ISwapManager
  private _oracleManager: IOracleManager
  private _tokensManager: ITokensManager

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    deploymentProvider: IDeploymentProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
    swapManager: ISwapManager
    oracleManager: IOracleManager
    tokensManager: ITokensManager
  }) {
    this._configProvider = params.configProvider
    this._deploymentProvider = params.deploymentProvider
    this._allowanceManager = params.allowanceManager
    this._contractsProvider = params.contractsProvider
    this._subgraphManager = params.subgraphManager
    this._blockchainClientProvider = params.blockchainClientProvider
    this._swapManager = params.swapManager
    this._oracleManager = params.oracleManager
    this._tokensManager = params.tokensManager

    this._supportedChains = this._configProvider
      .getConfigurationItem({
        name: 'SUMMER_DEPLOYED_CHAINS_ID',
      })
      .split(',')
      .map((chainId) => getChainInfoByChainId(Number(chainId)))
    const _hubChainId = this._configProvider.getConfigurationItem({
      name: 'SUMMER_HUB_CHAIN_ID',
    })
    this._hubChainInfo = getChainInfoByChainId(Number(_hubChainId))
    this._rewardsRedeemerAddress = getDeployedRewardsRedeemerAddress()

    this.utils = new ArmadaManagerUtils({
      configProvider: this._configProvider,
      allowanceManager: this._allowanceManager,
      contractsProvider: this._contractsProvider,
      blockchainClientProvider: this._blockchainClientProvider,
      tokensManager: this._tokensManager,
      oracleManager: this._oracleManager,
      subgraphManager: this._subgraphManager,
      swapManager: this._swapManager,
      deploymentProvider: this._deploymentProvider,
    })
    this.merklRewards = new ArmadaManagerMerklRewards({
      supportedChains: this._supportedChains,
      blockchainClientProvider: this._blockchainClientProvider,
      deploymentProvider: this._deploymentProvider,
    })
    this.claims = new ArmadaManagerClaims({
      ...params,
      hubChainInfo: this._hubChainInfo,
      rewardsRedeemerAddress: this._rewardsRedeemerAddress,
      supportedChains: this._supportedChains,
      utils: this.utils,
      merklRewards: this.merklRewards,
    })
    this.governance = new ArmadaManagerGovernance({
      ...params,
      hubChainInfo: this._hubChainInfo,
      utils: this.utils,
    })
    this.migrations = new ArmadaManagerMigrations({
      ...params,
      hubChainInfo: this._hubChainInfo,
      supportedChains: this._supportedChains,
      utils: this.utils,
    })
    this.bridge = new ArmadaManagerBridge({
      supportedChains: this._supportedChains,
      blockchainClientProvider: this._blockchainClientProvider,
      configProvider: this._configProvider,
      tokensManager: this._tokensManager,
      utils: this.utils,
    })
    this.vaults = new ArmadaManagerVaults({
      supportedChains: this._supportedChains,
      blockchainClientProvider: this._blockchainClientProvider,
      configProvider: this._configProvider,
      tokensManager: this._tokensManager,
      allowanceManager: this._allowanceManager,
      oracleManager: this._oracleManager,
      contractsProvider: this._contractsProvider,
      swapManager: this._swapManager,
      utils: this.utils,
      subgraphManager: this._subgraphManager,
      deploymentProvider: this._deploymentProvider,
    })

    this.admin = new ArmadaManagerAdmin({
      configProvider: this._configProvider,
      contractsProvider: this._contractsProvider,
      blockchainClientProvider: this._blockchainClientProvider,
    })
    this.accessControl = new ArmadaManagerAccessControl({
      configProvider: this._configProvider,
      contractsProvider: this._contractsProvider,
      blockchainClientProvider: this._blockchainClientProvider,
      deploymentProvider: this._deploymentProvider,
    })
  }
}
