import {
  ChainFamilyMap,
  type AddressValue,
  type IChainInfo,
  type ITokenAmount,
  type IUser,
} from '@summerfi/sdk-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IArmadaManagerMigrations } from '@summerfi/armada-protocol-common'

const addressesByChainId: Record<number, Record<string, AddressValue>> = {
  [ChainFamilyMap.Base.Base.chainId]: {
    usdc: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
    usdbc: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
    weth: '0x46e6b214b524310239732D51387075E0e70970bf',
    aero: '0x784efeB622244d2348d4F2522f8860B96fbEcE89',
  },
}

/**
 * @name ArmadaManagerMigrations
 * @description This class is the implementation of the IArmadaManagerMigrations interface
 */
export class ArmadaManagerMigrations implements IArmadaManagerMigrations {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _contractsProvider: IContractsProvider
  private _configProvider: IConfigurationProvider

  private _supportedChains: IChainInfo[]
  private _hubChainInfo: IChainInfo

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    contractsProvider: IContractsProvider
    configProvider: IConfigurationProvider
    supportedChains: IChainInfo[]
    hubChainInfo: IChainInfo
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._contractsProvider = params.contractsProvider
    this._configProvider = params.configProvider
    this._supportedChains = params.supportedChains
    this._hubChainInfo = params.hubChainInfo
  }

  async getMigratablePositions(params: {
    chainInfo: IChainInfo
    user: IUser
  }): Promise<{ chainInfo: IChainInfo; tokenAmount: ITokenAmount }[]> {
    // get the blockchain client for the provided chain
    const client = await this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })
    // get supported tokens from compound protocol
    const contractCommon = {
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ] as const,
    } as const
    const addresses = addressesByChainId[params.chainInfo.chainId]
    // read the users balances on provided chain for all supported tokens using multicall
    const balances = await client.readContract({
      abi: contractCommon.abi,
      address: addresses.usdc,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
    // filter the tokens that have balance > 0
    // return the chain info and token amount
  }
}
