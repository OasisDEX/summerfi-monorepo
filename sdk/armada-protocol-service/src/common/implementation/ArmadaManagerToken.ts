import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import {
  getDeployedContractAddress,
  type IArmadaManagerToken,
} from '@summerfi/armada-protocol-common'
import { Address, ChainFamilyMap, TransactionType, type IAddress } from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerToken implements IArmadaManagerToken {
  private _blockchainClientProvider: IBlockchainClientProvider

  private _summerTokenAddress: IAddress

  /** CONSTRUCTOR */
  constructor(params: { blockchainClientProvider: IBlockchainClientProvider }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._summerTokenAddress = getDeployedContractAddress({
      chainInfo: ChainFamilyMap.Base.Base,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })
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
        target: Address.createFromEthereum({ value: this._summerTokenAddress.value }),
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
        target: Address.createFromEthereum({ value: this._summerTokenAddress.value }),
        calldata: calldata,
        value: '0',
      },
    }
  }

  async delegates(
    params: Parameters<IArmadaManagerToken['delegates']>[0],
  ): ReturnType<IArmadaManagerToken['delegates']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const addressResult = await client.readContract({
      abi: SummerTokenAbi,
      address: this._summerTokenAddress.value,
      functionName: 'delegates',
      args: [params.user.wallet.address.value],
    })

    return Address.createFromEthereum({ value: addressResult })
  }

  async getVotes(
    params: Parameters<IArmadaManagerToken['getVotes']>[0],
  ): ReturnType<IArmadaManagerToken['getVotes']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    return client.readContract({
      abi: SummerTokenAbi,
      address: this._summerTokenAddress.value,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
  }
}
