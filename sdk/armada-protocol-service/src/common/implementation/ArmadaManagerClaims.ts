import { AdmiralsQuartersAbi, SummerRewardsRedeemerAbi } from '@summerfi/armada-protocol-abis'
import {
  type IArmadaManagerClaims,
  getClaims,
  getDeployedContractAddress,
  getDeployedRewardsRedeemerAddress,
} from '@summerfi/armada-protocol-common'
import { ChainFamilyMap, TransactionType, type IAddress } from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerClaims implements IArmadaManagerClaims {
  private _blockchainClientProvider: IBlockchainClientProvider

  private _rewardsRedeemerAddress: IAddress

  /** CONSTRUCTOR */
  constructor(params: { blockchainClientProvider: IBlockchainClientProvider }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._rewardsRedeemerAddress = getDeployedRewardsRedeemerAddress()
  }

  async canClaim(
    params: Parameters<IArmadaManagerClaims['canClaim']>[0],
  ): ReturnType<IArmadaManagerClaims['canClaim']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const claims = getClaims(params.user.wallet.address.value)

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

  async hasClaimed(
    params: Parameters<IArmadaManagerClaims['hasClaimed']>[0],
  ): ReturnType<IArmadaManagerClaims['hasClaimed']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const claims = getClaims(params.user.wallet.address.value)

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

  async amountToClaim(
    params: Parameters<IArmadaManagerClaims['amountToClaim']>[0],
  ): ReturnType<IArmadaManagerClaims['amountToClaim']> {
    const claims = getClaims(params.user.wallet.address.value)

    const amount = claims.map((claim) => claim.amount).reduce((acc, curr) => acc + curr, 0n)

    return amount
  }

  async getClaimMerkleRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimMerkleRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimMerkleRewardsTx']> {
    const claims = getClaims(params.user.wallet.address.value)

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

  async getClaimGovernanceRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimGovernanceRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimGovernanceRewardsTx']> {
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

  async getClaimFleetRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimFleetRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimFleetRewardsTx']> {
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
