import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  IContractsProvider,
  IErc20Contract,
  IErc4626Contract,
  IFleetCommanderContract,
  IProtocolAccessManagerWhiteListContract,
  IArkContract,
  IAdmiralsQuartersContract,
  IConfigurationManagerContract,
  ISummerStakingContract,
} from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, getChainInfoByChainId, type ChainId } from '@summerfi/sdk-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { Erc20Contract } from './contracts/Erc20Contract/Erc20Contract'
import { Erc4626Contract } from './contracts/Erc4626Contract/Erc4626Contract'
import { FleetCommanderContract } from './contracts/FleetCommanderContract/FleetCommanderContract'
import { ProtocolAccessManagerWhiteListContract } from './contracts/ProtocolAccessManagerWhiteListContract/ProtocolAccessManagerWhiteListContract'
import { ArkContract } from './contracts/ArkContract'
import { AdmiralsQuartersContract } from './contracts/AdmiralsQuartersContract/AdmiralsQuartersContract'
import { ConfigurationManagerContract } from './contracts/ConfigurationManagerContract/ConfigurationManagerContract'
import { SummerStakingContract } from './contracts/SummerStakingContract/SummerStakingContract'

/**
 * @name ContractsProvider
 * @implements IContractsProvider
 */
export class ContractsProvider implements IContractsProvider {
  private _configProvider: IConfigurationProvider
  private _blockchainClientProvider: IBlockchainClientProvider
  private _tokensManager: ITokensManager

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    blockchainClientProvider: IBlockchainClientProvider
    tokensManager: ITokensManager
  }) {
    this._configProvider = params.configProvider
    this._blockchainClientProvider = params.blockchainClientProvider
    this._tokensManager = params.tokensManager
  }

  /** PUBLIC */

  /** @see IContractsProvider.getErc20Contract */
  async getErc20Contract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IErc20Contract> {
    return Erc20Contract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      tokensManager: this._tokensManager,
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getErc4626Contract */
  async getErc4626Contract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IErc4626Contract> {
    return Erc4626Contract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      tokensManager: this._tokensManager,
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getFleetCommanderContract */
  async getFleetCommanderContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IFleetCommanderContract> {
    return FleetCommanderContract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      tokensManager: this._tokensManager,
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getProtocolAccessManagerWhiteListContract */
  async getProtocolAccessManagerWhiteListContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IProtocolAccessManagerWhiteListContract> {
    return ProtocolAccessManagerWhiteListContract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getArkContract */
  async getArkContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IArkContract> {
    return ArkContract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      tokensManager: this._tokensManager,
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getAdmiralsQuartersContract */
  async getAdmiralsQuartersContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IAdmiralsQuartersContract> {
    return AdmiralsQuartersContract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getConfigurationManagerContract */
  async getConfigurationManagerContract(params: {
    chainId: ChainId
    address: IAddress
  }): Promise<IConfigurationManagerContract> {
    const chainInfo = getChainInfoByChainId(params.chainId)

    return ConfigurationManagerContract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo,
      }),
      chainInfo,
      address: params.address,
    })
  }

  /** @see IContractsProvider.getSummerStakingContract */
  async getSummerStakingContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<ISummerStakingContract> {
    return SummerStakingContract.create({
      blockchainClient: this._blockchainClientProvider.getBlockchainClient({
        chainInfo: params.chainInfo,
      }),
      chainInfo: params.chainInfo,
      address: params.address,
    })
  }
}
