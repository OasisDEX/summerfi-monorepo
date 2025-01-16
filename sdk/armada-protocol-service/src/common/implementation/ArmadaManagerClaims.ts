import {
  AdmiralsQuartersAbi,
  GovernanceRewardsManagerAbi,
  StakingRewardsManagerBaseAbi,
  SummerRewardsRedeemerAbi,
  SummerTokenAbi,
} from '@summerfi/armada-protocol-abis'
import {
  type IArmadaManagerClaims,
  getAllMerkleClaims,
  getDeployedContractAddress,
  getDeployedRewardsRedeemerAddress,
} from '@summerfi/armada-protocol-common'
import {
  ChainFamilyMap,
  TransactionType,
  type IAddress,
  type IChainInfo,
  type IUser,
} from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerClaims implements IArmadaManagerClaims {
  private _blockchainClientProvider: IBlockchainClientProvider

  private _hubChainInfo: IChainInfo
  private _rewardsRedeemerAddress: IAddress

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    hubChainInfo: IChainInfo
    rewardsRedeemerAddress: IAddress
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._hubChainInfo = params.hubChainInfo
    this._rewardsRedeemerAddress = params.rewardsRedeemerAddress
  }

  async canClaimDistributions(
    params: Parameters<IArmadaManagerClaims['canClaimDistributions']>[0],
  ): ReturnType<IArmadaManagerClaims['canClaimDistributions']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const claims = getAllMerkleClaims(params.user.wallet.address.value)

    const promises = claims.map((claim) =>
      client.readContract({
        abi: SummerRewardsRedeemerAbi,
        address: this._rewardsRedeemerAddress.value,
        functionName: 'canClaim',
        args: [params.user.wallet.address.value, claim.index, claim.amount, claim.proof],
      }),
    )

    const canClaimResults = await Promise.all(promises)

    return claims.map((claim, index) => [claim.index, canClaimResults[index]])
  }

  async hasClaimedDistributions(
    params: Parameters<IArmadaManagerClaims['hasClaimedDistributions']>[0],
  ): ReturnType<IArmadaManagerClaims['hasClaimedDistributions']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const claims = getAllMerkleClaims(params.user.wallet.address.value)

    const promises = claims.map((claim) =>
      client.readContract({
        abi: SummerRewardsRedeemerAbi,
        address: this._rewardsRedeemerAddress.value,
        functionName: 'hasClaimed',
        args: [params.user.wallet.address.value, claim.index],
      }),
    )

    const hasClaimedResults = await Promise.all(promises)

    return claims.map((claim, index) => [claim.index, hasClaimedResults[index]])
  }

  private async getMerkleDistributionRewards(user: IUser): Promise<bigint> {
    const merkleClaims = getAllMerkleClaims(user.wallet.address.value)

    // TODO: check if has claimed?

    // get merkle rewards amount
    return merkleClaims.map((claim) => claim.amount).reduce((acc, curr) => acc + curr, 0n)
  }

  private async getVoteDelegationRewards(user: IUser): Promise<bigint> {
    const summerTokenAddress = getDeployedContractAddress({
      chainInfo: this._hubChainInfo,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })
    const rewardsManagerAddressString = await client.readContract({
      abi: SummerTokenAbi,
      address: summerTokenAddress.value,
      functionName: 'rewardsManager',
      args: [],
    })
    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddressString,
      functionName: 'earned',
      args: [user.wallet.address.value, summerTokenAddress.value],
    })
  }

  private async getProtocolUsageRewards(user: IUser, chainInfo: IChainInfo): Promise<bigint> {
    // TODO: implement
    throw new Error('Not implemented')
  }

  async aggregatedRewards(
    params: Parameters<IArmadaManagerClaims['aggregatedRewards']>[0],
  ): ReturnType<IArmadaManagerClaims['aggregatedRewards']> {
    const merkleDistributionRewards = await this.getMerkleDistributionRewards(params.user)
    const voteDelegationRewards = await this.getVoteDelegationRewards(params.user)
    const protocolUsageRewards = await this.getProtocolUsageRewards(params.user)

    const total = merkleDistributionRewards + voteDelegationRewards + protocolUsageRewards
    const perChain = {
      [params.user.chainInfo.chainId]: total,
    }

    return {
      total,
      perChain,
    }
  }

  async getClaimDistributionTx(
    params: Parameters<IArmadaManagerClaims['getClaimDistributionTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimDistributionTx']> {
    const claims = getAllMerkleClaims(params.user.wallet.address.value)

    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'claimMerkleRewards',
      args: [
        params.user.wallet.address.value,
        claims.map((claim) => claim.index),
        claims.map((claim) => claim.amount),
        claims.map((claim) => claim.proof),
        this._rewardsRedeemerAddress.value,
      ],
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: ChainFamilyMap.Base.Base,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    return {
      type: TransactionType.Claim,
      description: 'Claiming merkle rewards',
      transaction: {
        target: admiralsQuartersAddress,
        calldata: calldata,
        value: '0',
      },
    }
  }

  async getClaimVoteDelegationRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimVoteDelegationRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimVoteDelegationRewardsTx']> {
    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'claimGovernanceRewards',
      args: [params.govRewardsManagerAddress.value, params.rewardToken.value],
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: ChainFamilyMap.Base.Base,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    return {
      type: TransactionType.Claim,
      description: 'Claiming governance rewards',
      transaction: {
        target: admiralsQuartersAddress,
        calldata: calldata,
        value: '0',
      },
    }
  }

  async getClaimProtocolUsageRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimProtocolUsageRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimProtocolUsageRewardsTx']> {
    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'claimFleetRewards',
      args: [params.fleetCommandersAddresses.map((a) => a.value), params.rewardToken.value],
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    return {
      type: TransactionType.Claim,
      description: 'Claiming fleet rewards',
      transaction: {
        target: admiralsQuartersAddress,
        calldata: calldata,
        value: '0',
      },
    }
  }
}
