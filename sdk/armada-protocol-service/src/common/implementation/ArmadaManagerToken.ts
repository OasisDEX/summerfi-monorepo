import { GovernanceRewardsManagerAbi, SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import {
  getDeployedContractAddress,
  type IArmadaManagerToken,
} from '@summerfi/armada-protocol-common'
import { Address, TransactionType, type IAddress, type IChainInfo } from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerToken implements IArmadaManagerToken {
  private _blockchainClientProvider: IBlockchainClientProvider

  private _hubChainSummerTokenAddress: IAddress
  private _hubChainInfo: IChainInfo

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    hubChainInfo: IChainInfo
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._hubChainInfo = params.hubChainInfo

    this._hubChainSummerTokenAddress = getDeployedContractAddress({
      chainInfo: this._hubChainInfo,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })
  }

  async delegates(
    params: Parameters<IArmadaManagerToken['delegates']>[0],
  ): ReturnType<IArmadaManagerToken['delegates']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const addressResult = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'delegates',
      args: [params.user.wallet.address.value],
    })

    return Address.createFromEthereum({ value: addressResult })
  }

  async getDelegateTx(
    params: Parameters<IArmadaManagerToken['getDelegateTx']>[0],
  ): ReturnType<IArmadaManagerToken['getDelegateTx']> {
    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: [params.user.wallet.address.value],
    })

    return {
      type: TransactionType.Delegate,
      description: 'Delegating votes',
      transaction: {
        target: Address.createFromEthereum({ value: this._hubChainSummerTokenAddress.value }),
        calldata: calldata,
        value: '0',
      },
    }
  }

  async getUndelegateTx(): ReturnType<IArmadaManagerToken['getUndelegateTx']> {
    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: ['0x0'],
    })

    return {
      type: TransactionType.Delegate,
      description: 'Undelegating votes',
      transaction: {
        target: Address.createFromEthereum({ value: this._hubChainSummerTokenAddress.value }),
        calldata: calldata,
        value: '0',
      },
    }
  }

  async getVotes(
    params: Parameters<IArmadaManagerToken['getVotes']>[0],
  ): ReturnType<IArmadaManagerToken['getVotes']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    return client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'getVotes',
      args: [params.user.wallet.address.value],
    })
  }

  async getStakedBalance(
    params: Parameters<IArmadaManagerToken['getStakedBalance']>[0],
  ): ReturnType<IArmadaManagerToken['getStakedBalance']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const rewardsManagerAddressString = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'rewardsManager',
      args: [],
    })

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddressString,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
  }

  async getStakeTx(
    params: Parameters<IArmadaManagerToken['getStakeTx']>[0],
  ): ReturnType<IArmadaManagerToken['getStakeTx']> {
    const calldata = encodeFunctionData({
      abi: GovernanceRewardsManagerAbi,
      functionName: 'stake',
      args: [params.amount],
    })

    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })
    const rewardsManagerAddressString = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'rewardsManager',
      args: [],
    })

    return {
      type: TransactionType.Stake,
      description: 'Staking tokens',
      transaction: {
        target: Address.createFromEthereum({ value: rewardsManagerAddressString }),
        calldata: calldata,
        value: '0',
      },
    }
  }

  async getUnstakeTx(
    params: Parameters<IArmadaManagerToken['getUnstakeTx']>[0],
  ): ReturnType<IArmadaManagerToken['getUnstakeTx']> {
    const calldata = encodeFunctionData({
      abi: GovernanceRewardsManagerAbi,
      functionName: 'unstake',
      args: [params.amount],
    })

    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })
    const rewardsManagerAddressString = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'rewardsManager',
      args: [],
    })

    return {
      type: TransactionType.Unstake,
      description: 'Unstaking tokens',
      transaction: {
        target: Address.createFromEthereum({ value: rewardsManagerAddressString }),
        calldata: calldata,
        value: '0',
      },
    }
  }
}
