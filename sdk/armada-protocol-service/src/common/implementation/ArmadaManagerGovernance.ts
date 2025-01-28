import { GovernanceRewardsManagerAbi, SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import {
  getDeployedContractAddress,
  type IArmadaManagerGovernance,
} from '@summerfi/armada-protocol-common'
import {
  Address,
  TokenAmount,
  TransactionType,
  type IAddress,
  type IChainInfo,
  type IToken,
} from '@summerfi/sdk-common'
import { encodeFunctionData, zeroAddress } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerGovernance implements IArmadaManagerGovernance {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _allowanceManager: IAllowanceManager
  private _getSummerToken: (params: { chainInfo: IChainInfo }) => IToken

  private _hubChainSummerTokenAddress: IAddress
  private _hubChainInfo: IChainInfo

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    allowanceManager: IAllowanceManager
    hubChainInfo: IChainInfo
    getSummerToken: (params: { chainInfo: IChainInfo }) => IToken
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._allowanceManager = params.allowanceManager
    this._hubChainInfo = params.hubChainInfo
    this._getSummerToken = params.getSummerToken

    this._hubChainSummerTokenAddress = getDeployedContractAddress({
      chainInfo: this._hubChainInfo,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })
  }

  async getUserDelegatee(
    params: Parameters<IArmadaManagerGovernance['getUserDelegatee']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserDelegatee']> {
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
    params: Parameters<IArmadaManagerGovernance['getDelegateTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getDelegateTx']> {
    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: [params.user.wallet.address.value],
    })

    return [
      {
        type: TransactionType.Delegate,
        description: 'Delegating votes',
        transaction: {
          target: Address.createFromEthereum({ value: this._hubChainSummerTokenAddress.value }),
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getUndelegateTx(): ReturnType<IArmadaManagerGovernance['getUndelegateTx']> {
    const calldata = encodeFunctionData({
      abi: SummerTokenAbi,
      functionName: 'delegate',
      args: [zeroAddress],
    })

    return [
      {
        type: TransactionType.Delegate,
        description: 'Undelegating votes',
        transaction: {
          target: Address.createFromEthereum({ value: this._hubChainSummerTokenAddress.value }),
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getUserVotes(
    params: Parameters<IArmadaManagerGovernance['getUserVotes']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserVotes']> {
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

  async getUserBalance(
    params: Parameters<IArmadaManagerGovernance['getUserBalance']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserBalance']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    return client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'balanceOf',
      args: [params.user.wallet.address.value],
    })
  }

  async getUserStakedBalance(
    params: Parameters<IArmadaManagerGovernance['getUserStakedBalance']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakedBalance']> {
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

  async getUserEarnedRewards(
    params: Parameters<IArmadaManagerGovernance['getUserEarnedRewards']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserEarnedRewards']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const rewardsManagerAddressString = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'rewardsManager',
      args: [],
    })

    // for now reward token is just summer token
    // in future potential partners can be added
    const rewardToken = this._hubChainSummerTokenAddress

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddressString,
      functionName: 'earned',
      args: [params.user.wallet.address.value, rewardToken.value],
    })
  }

  async getStakeTx(
    params: Parameters<IArmadaManagerGovernance['getStakeTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeTx']> {
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

    const stakeTx = {
      type: TransactionType.Stake,
      description: 'Staking tokens',
      transaction: {
        target: Address.createFromEthereum({ value: rewardsManagerAddressString }),
        calldata: calldata,
        value: '0',
      },
    } as const

    const approveToStakeUserTokens = await this._allowanceManager.getApproval({
      chainInfo: this._hubChainInfo,
      spender: Address.createFromEthereum({ value: rewardsManagerAddressString }),
      amount: TokenAmount.createFromBaseUnit({
        amount: params.amount.toString(),
        token: this._getSummerToken({
          chainInfo: this._hubChainInfo,
        }),
      }),
      owner: params.user.wallet.address,
    })

    if (approveToStakeUserTokens) {
      return [approveToStakeUserTokens, stakeTx]
    } else {
      return [stakeTx]
    }
  }

  async getUnstakeTx(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTx']> {
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

    return [
      {
        type: TransactionType.Unstake,
        description: 'Unstaking tokens',
        transaction: {
          target: Address.createFromEthereum({ value: rewardsManagerAddressString }),
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }
}
