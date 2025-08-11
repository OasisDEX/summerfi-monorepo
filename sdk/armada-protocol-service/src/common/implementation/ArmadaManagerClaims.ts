import {
  AdmiralsQuartersAbi,
  GovernanceRewardsManagerAbi,
  StakingRewardsManagerBaseAbi,
  SummerRewardsRedeemerAbi,
} from '@summerfi/armada-protocol-abis'
import {
  type IArmadaManagerClaims,
  type IArmadaManagerMerklRewards,
  type IArmadaManagerUtils,
  type MerklReward,
  getAllMerkleClaims,
  getDeployedGovRewardsManagerAddress,
  isTestDeployment,
} from '@summerfi/armada-protocol-common'
import {
  Address,
  getChainInfoByChainId,
  LoggingService,
  TransactionType,
  type ChainId,
  type ClaimTransactionInfo,
  type HexData,
  type IAddress,
  type IChainInfo,
  type IUser,
} from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import type { IDeploymentProvider } from '../../deployment-provider/IDeploymentProvider'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerClaims implements IArmadaManagerClaims {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _deploymentProvider: IDeploymentProvider
  private _contractsProvider: IContractsProvider
  private _configProvider: IConfigurationProvider
  private _tokensManager: ITokensManager
  private _utils: IArmadaManagerUtils
  private _merkleRewards: IArmadaManagerMerklRewards

  private _supportedChains: IChainInfo[]
  private _hubChainInfo: IChainInfo
  private _rewardsRedeemerAddress: IAddress
  private _distributionsUrls: string[]
  private _subgraphManager: IArmadaSubgraphManager

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    deploymentProvider: IDeploymentProvider
    contractsProvider: IContractsProvider
    configProvider: IConfigurationProvider
    supportedChains: IChainInfo[]
    hubChainInfo: IChainInfo
    rewardsRedeemerAddress: IAddress
    utils: IArmadaManagerUtils
    merkleRewards: IArmadaManagerMerklRewards
    subgraphManager: IArmadaSubgraphManager
    tokensManager: ITokensManager
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._deploymentProvider = params.deploymentProvider
    this._contractsProvider = params.contractsProvider
    this._configProvider = params.configProvider
    this._supportedChains = params.supportedChains
    this._hubChainInfo = params.hubChainInfo
    this._rewardsRedeemerAddress = params.rewardsRedeemerAddress
    this._utils = params.utils
    this._merkleRewards = params.merkleRewards
    this._subgraphManager = params.subgraphManager
    this._tokensManager = params.tokensManager

    const _distributionsBaseUrl = this._configProvider.getConfigurationItem({
      name: 'SDK_DISTRIBUTIONS_BASE_URL',
    })
    this._distributionsUrls = this._configProvider
      .getConfigurationItem({
        name: 'SDK_DISTRIBUTIONS_FILES',
      })
      .split(',')
      .map((file) => new URL(file.trim(), _distributionsBaseUrl.trim()).toString())
  }

  getSummerToken(
    params: Parameters<IArmadaManagerUtils['getSummerToken']>[0],
  ): ReturnType<IArmadaManagerUtils['getSummerToken']> {
    const tokenSymbol = isTestDeployment() ? 'BUMMER' : 'SUMR'

    return this._tokensManager.getTokenBySymbol({
      chainInfo: params.chainInfo,
      symbol: tokenSymbol,
    })
  }

  async canClaimDistributions(
    params: Parameters<IArmadaManagerClaims['canClaimDistributions']>[0],
  ): ReturnType<IArmadaManagerClaims['canClaimDistributions']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const merkleClaims = await getAllMerkleClaims({
      distributionsUrls: this._distributionsUrls,
      walletAddress: params.user.wallet.address.value,
    })

    const canClaimCalls = merkleClaims.map(
      (claim) =>
        ({
          abi: SummerRewardsRedeemerAbi,
          address: claim.contractAddress,
          functionName: 'canClaim',
          args: [params.user.wallet.address.value, claim.index, claim.amount, claim.proof],
        }) as const,
    )

    const canClaimResults = await client.multicall({
      contracts: canClaimCalls,
    })

    const canClaimRecord: Record<string, Record<string, boolean>> = {}

    canClaimResults.forEach((result, index) => {
      if (result.status === 'success') {
        canClaimRecord[merkleClaims[index].contractAddress] =
          canClaimRecord[merkleClaims[index].contractAddress] || {}
        canClaimRecord[merkleClaims[index].contractAddress][merkleClaims[index].index.toString()] =
          result.result
      } else {
        throw new Error('Error in multicall reading canClaimDistributions: ' + result.error)
      }
    })

    return canClaimRecord
  }

  async hasClaimedDistributions(
    params: Parameters<IArmadaManagerClaims['hasClaimedDistributions']>[0],
  ): ReturnType<IArmadaManagerClaims['hasClaimedDistributions']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const merkleClaims = await getAllMerkleClaims({
      distributionsUrls: this._distributionsUrls,
      walletAddress: params.user.wallet.address.value,
    })
    const hasClaimedCalls = merkleClaims.map(
      (claim) =>
        ({
          abi: SummerRewardsRedeemerAbi,
          address: claim.contractAddress,
          functionName: 'hasClaimed',
          args: [params.user.wallet.address.value, claim.index],
        }) as const,
    )

    const hasClaimedResults = await client.multicall({
      contracts: hasClaimedCalls,
    })

    const hasClaimedPerContract: Record<string, Record<string, boolean>> = {}

    hasClaimedResults.forEach((result, index) => {
      if (result.status === 'success') {
        hasClaimedPerContract[merkleClaims[index].contractAddress] =
          hasClaimedPerContract[merkleClaims[index].contractAddress] || {}
        hasClaimedPerContract[merkleClaims[index].contractAddress][
          merkleClaims[index].index.toString()
        ] = result.result
      } else {
        throw new Error('Error in multicall reading hasClaimedDistributions: ' + result.error)
      }
    })

    return hasClaimedPerContract
  }

  private async getMerkleDistributionRewards(user: IUser): Promise<bigint> {
    const [merkleClaims, hasClaimedRecord] = await Promise.all([
      getAllMerkleClaims({
        distributionsUrls: this._distributionsUrls,
        walletAddress: user.wallet.address.value,
      }),
      this.hasClaimedDistributions({ user }),
    ])

    // get merkle rewards amount
    return merkleClaims.reduce((amount, claim) => {
      if (hasClaimedRecord[claim.contractAddress][claim.index.toString()]) {
        return amount
      } else {
        return amount + claim.amount
      }
    }, 0n)
  }

  private async getVoteDelegationRewards(user: IUser): Promise<bigint> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const rewardsManagerAddress = getDeployedGovRewardsManagerAddress()
    const rewardToken = this._utils.getSummerToken({ chainInfo: this._hubChainInfo })

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
      functionName: 'earned',
      args: [user.wallet.address.value, rewardToken.address.value],
    })
  }

  private async getProtocolUsageRewards(
    user: IUser,
    chainInfo: IChainInfo,
  ): Promise<{
    total: bigint
    perFleet: Record<string, bigint>
  }> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo,
    })

    const summerTokenAddress = this.getSummerToken({ chainInfo }).address

    const vaults = await this._subgraphManager.getVaults({ chainId: chainInfo.chainId })
    const fleetCommanderAddresses = vaults.vaults.map((vault) => vault.id as `0x${string}`)
    const stakingRewardsManagerAddresses = vaults.vaults.map(
      (vault) => vault.rewardsManager.id as `0x${string}`,
    )
    // readContract summer token abi

    const contractCalls: {
      abi: typeof StakingRewardsManagerBaseAbi
      address: HexData
      functionName: 'earned'
    }[] = []
    for (let index = 0; index < fleetCommanderAddresses.length; index++) {
      // read earned staking rewards from rewards manager
      const earnedCall = {
        abi: StakingRewardsManagerBaseAbi,
        address: stakingRewardsManagerAddresses[index],
        functionName: 'earned',
        args: [user.wallet.address.value, summerTokenAddress.value],
      } as const
      contractCalls.push(earnedCall)
    }

    const perFleet = await client
      .multicall({
        contracts: contractCalls,
      })
      .then((multicallResults) => {
        return multicallResults.reduce(
          (earnedDict, result, index) => {
            if (result.status === 'success') {
              const address = fleetCommanderAddresses[index]
              earnedDict[address] = result.result
              return earnedDict
            } else {
              throw new Error('Error in multicall reading protocol usage rewards: ' + result.error)
            }
          },
          {} as Record<string, bigint>,
        )
      })

    return {
      total: Object.values(perFleet).reduce((acc, rewards) => acc + rewards, 0n),
      perFleet: perFleet,
    }
  }

  async getAggregatedRewards(
    params: Parameters<IArmadaManagerClaims['getAggregatedRewards']>[0],
  ): ReturnType<IArmadaManagerClaims['getAggregatedRewards']> {
    const [merkleDistributionRewards, voteDelegationRewards] = await Promise.all([
      this.getMerkleDistributionRewards(params.user),
      this.getVoteDelegationRewards(params.user),
    ])

    // get protocol usage rewards for each chain
    const perChain: Record<number, bigint> = {}

    let totalUsageRewards = 0n
    const perChainRewards = await Promise.all(
      this._supportedChains.map(async (chainInfo) => {
        const usageRewards = await this.getProtocolUsageRewards(params.user, chainInfo)

        if (chainInfo.chainId === this._hubChainInfo.chainId) {
          // on hubchain we add delegation and distribution rewards
          perChain[chainInfo.chainId] =
            usageRewards.total + voteDelegationRewards + merkleDistributionRewards
        } else {
          // on other chains we add only protocol usage rewards
          perChain[chainInfo.chainId] = usageRewards.total
        }
        return usageRewards
      }),
    )
    totalUsageRewards = perChainRewards.reduce((acc, rewards) => acc + rewards.total, 0n)

    const total = merkleDistributionRewards + voteDelegationRewards + totalUsageRewards

    return {
      total,
      perChain,
      vaultUsagePerChain: perChain,
      vaultUsage: totalUsageRewards,
      merkleDistribution: merkleDistributionRewards,
      voteDelegation: voteDelegationRewards,
    }
  }

  private getMerklUsageForChain(
    merklRewards: { perChain: Partial<Record<ChainId, MerklReward[]>> },
    chainId: number,
  ): bigint {
    const merklUsage = merklRewards.perChain[chainId as ChainId] || []
    return merklUsage
      .filter(
        (item: MerklReward) =>
          item.token.address ===
          this.getSummerToken({ chainInfo: getChainInfoByChainId(chainId as ChainId) }).address
            .value,
      )
      .reduce((sum: bigint, item: MerklReward) => sum + BigInt(item.amount), 0n)
  }

  async getAggregatedRewardsIncludingMerkl(
    params: Parameters<IArmadaManagerClaims['getAggregatedRewardsIncludingMerkl']>[0],
  ): ReturnType<IArmadaManagerClaims['getAggregatedRewardsIncludingMerkl']> {
    const rewards = await this.getAggregatedRewards(params)

    const merklRewards = await this._merkleRewards.getUserMerklRewards({
      address: params.user.wallet.address.value,
    })

    const vaultUsagePerChain: Record<number, bigint> = {}
    for (const [chainId, usage] of Object.entries(rewards.vaultUsagePerChain)) {
      const totalMerklUsage = this.getMerklUsageForChain(merklRewards, Number(chainId))
      vaultUsagePerChain[Number(chainId)] = usage + totalMerklUsage
    }

    const vaultUsage = Object.values(vaultUsagePerChain).reduce((acc, usage) => acc + usage, 0n)
    const total = rewards.merkleDistribution + rewards.voteDelegation + vaultUsage

    return {
      total,
      vaultUsagePerChain,
      vaultUsage,
      merkleDistribution: rewards.merkleDistribution,
      voteDelegation: rewards.voteDelegation,
    }
  }

  async getClaimableAggregatedRewards(
    params: Parameters<IArmadaManagerClaims['getClaimableAggregatedRewards']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimableAggregatedRewards']> {
    return this.getAggregatedRewards(params)
  }

  async getClaimDistributionTx(
    params: Parameters<IArmadaManagerClaims['getClaimDistributionTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimDistributionTx']> {
    const [merkleClaims, hasClaimedRecord, canClaimRecord] = await Promise.all([
      getAllMerkleClaims({
        distributionsUrls: this._distributionsUrls,
        walletAddress: params.user.wallet.address.value,
      }),
      this.hasClaimedDistributions({ user: params.user }),
      this.canClaimDistributions({ user: params.user }),
    ])

    LoggingService.debug(
      'Claiming merkle claims for ' + params.user.toString(),
      merkleClaims.map(({ amount, index }) => ({ amount, index })),
      'has claimed record: ',
      hasClaimedRecord,
      'can claim record: ',
      canClaimRecord,
    )

    // filter not claimed rewards
    const filteredClaims = merkleClaims.filter((claim) => {
      const hasClaimed = hasClaimedRecord[claim.contractAddress][claim.index.toString()]
      const canClaim = canClaimRecord[claim.contractAddress][claim.index.toString()]
      return !hasClaimed && canClaim && claim.amount > BigInt(0)
    }, 0n)

    // if no claims to process, return empty array
    if (filteredClaims.length === 0) {
      LoggingService.debug('No merkle claims for ' + params.user.toString())
      return
    } else {
      LoggingService.debug(
        'Unclaimed merkle claims for ' + params.user.toString(),
        filteredClaims.map(({ amount, index }) => ({ amount, index })),
      )
    }

    // group claims by claim.contractAddress as key
    const rewardsRecords = filteredClaims.reduce(
      (acc, claim) => {
        const key = claim.contractAddress.toLowerCase() as HexData
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(claim)
        return acc
      },
      {} as Record<HexData, typeof filteredClaims>,
    )

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'admiralsQuarters',
      chainId: this._hubChainInfo.chainId,
    })

    const transactions: ClaimTransactionInfo[] = []

    for (const [contractAddress, claims] of Object.entries(rewardsRecords)) {
      LoggingService.debug(
        `Processing ${claims.length} merkle claims for contract: ${contractAddress}`,
        claims.map(({ amount, index }) => ({ amount, index })),
      )
      const indices = claims.map((claim) => claim.index)
      const amounts = claims.map((claim) => claim.amount)
      const proofs = claims.map((claim) => claim.proof)

      const calldata = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'claimMerkleRewards',
        args: [
          params.user.wallet.address.value,
          indices,
          amounts,
          proofs,
          contractAddress as HexData,
        ],
      })
      transactions.push({
        type: TransactionType.Claim,
        description: 'Claiming merkle rewards',
        transaction: {
          target: admiralsQuartersAddress,
          calldata: calldata,
          value: '0',
        },
      })
    }

    return transactions
  }

  async getClaimVoteDelegationRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimVoteDelegationRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimVoteDelegationRewardsTx']> {
    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'claimGovernanceRewards',
      args: [params.govRewardsManagerAddress.value, params.rewardToken.value],
    })

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      contractName: 'admiralsQuarters',
      chainId: this._hubChainInfo.chainId,
    })

    return [
      {
        type: TransactionType.Claim,
        description: 'Claiming governance rewards',
        transaction: {
          target: admiralsQuartersAddress,
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getClaimProtocolUsageRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimProtocolUsageRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimProtocolUsageRewardsTx']> {
    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'claimFleetRewards',
      args: [params.fleetCommandersAddresses.map((a) => a.value), params.rewardToken.value],
    })

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId: params.chainInfo.chainId,
      contractName: 'admiralsQuarters',
    })

    return [
      {
        type: TransactionType.Claim,
        description: 'Claiming fleet rewards',
        transaction: {
          target: admiralsQuartersAddress,
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getAggregatedClaimsForChainTx(
    params: Parameters<IArmadaManagerClaims['getAggregatedClaimsForChainTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getAggregatedClaimsForChainTx']> {
    const isHubChain = params.chainInfo.chainId === this._hubChainInfo.chainId

    const govRewardsManagerAddress = getDeployedGovRewardsManagerAddress()

    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const gatherMulticallArgsFromRequests: Promise<void>[] = []

    if (isHubChain) {
      gatherMulticallArgsFromRequests.push(
        this.getMerkleDistributionRewards(params.user).then((merkleDistributionRewards) => {
          if (merkleDistributionRewards > 0n) {
            return this.getClaimDistributionTx({ user: params.user }).then((claimMerkleRewards) => {
              if (!claimMerkleRewards) {
                return
              }
              multicallArgs.push(claimMerkleRewards[0].transaction.calldata)
              multicallOperations.push('merkle rewards: ' + merkleDistributionRewards)
            })
          }
        }),
      )

      const govRewardToken = this.getSummerToken({ chainInfo: this._hubChainInfo }).address

      gatherMulticallArgsFromRequests.push(
        this.getVoteDelegationRewards(params.user).then((voteDelegationRewards) => {
          if (voteDelegationRewards > 0n) {
            return this.getClaimVoteDelegationRewardsTx({
              govRewardsManagerAddress,
              rewardToken: govRewardToken,
            }).then((claimGovernanceRewards) => {
              multicallArgs.push(claimGovernanceRewards[0].transaction.calldata)
              multicallOperations.push('governance rewards: ' + voteDelegationRewards)
            })
          }
        }),
      )
    }

    const fleetRewardToken = this.getSummerToken({ chainInfo: params.chainInfo }).address

    gatherMulticallArgsFromRequests.push(
      this.getProtocolUsageRewards(params.user, params.chainInfo).then((protocolUsageRewards) => {
        if (protocolUsageRewards.total > 0n) {
          const fleetCommandersAddresses = Object.entries(protocolUsageRewards.perFleet)
            .filter(([_, rewards]) => rewards > 0n)
            .map(([addressKey]) => Address.createFromEthereum({ value: addressKey }))
          LoggingService.debug(
            'Claiming fleet rewards for fleets:',
            fleetCommandersAddresses.map((a) => a.value),
          )

          return this.getClaimProtocolUsageRewardsTx({
            chainInfo: params.chainInfo,
            user: params.user,
            fleetCommandersAddresses,
            rewardToken: fleetRewardToken,
          }).then((claimFleetRewards) => {
            multicallArgs.push(claimFleetRewards[0].transaction.calldata)
            multicallOperations.push('fleet rewards: ' + protocolUsageRewards.total)
          })
        }
      }),
    )

    // fetch and parse multicall args from the async requests results
    await Promise.all(gatherMulticallArgsFromRequests)

    // results are in multicallArgs
    if (multicallArgs.length === 0) {
      return undefined
    }

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId: params.chainInfo.chainId,
      contractName: 'admiralsQuarters',
    })

    const multicallCalldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'multicall',
      args: [multicallArgs],
    })

    LoggingService.debug(
      'Multicall with claims on: ' + params.chainInfo.toString(),
      multicallOperations,
    )

    return [
      {
        type: TransactionType.Claim,
        description: 'Claiming aggregated rewards',
        transaction: {
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          value: '0',
        },
      },
    ]
  }
}
