import {
  AdmiralsQuartersAbi,
  GovernanceRewardsManagerAbi,
  StakingRewardsManagerBaseAbi,
  SummerRewardsRedeemerAbi,
  SummerStakingAbi,
} from '@summerfi/armada-protocol-abis'
import {
  type IArmadaManagerClaims,
  type IArmadaManagerMerklRewards,
  type IArmadaManagerUtils,
  type MerklReward,
  getAllDistributionClaims,
  getDeployedGovAddress,
} from '@summerfi/armada-protocol-common'
import {
  Address,
  ChainIds,
  getChainInfoByChainId,
  LoggingService,
  TransactionType,
  type AddressValue,
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
  private _merklRewards: IArmadaManagerMerklRewards

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
    merklRewards: IArmadaManagerMerklRewards
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
    this._merklRewards = params.merklRewards
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

  async canClaimDistributions(
    params: Parameters<IArmadaManagerClaims['canClaimDistributions']>[0],
  ): ReturnType<IArmadaManagerClaims['canClaimDistributions']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.user.chainInfo,
    })

    const distributionClaims = await getAllDistributionClaims({
      distributionsUrls: this._distributionsUrls,
      walletAddress: params.user.wallet.address.value,
    })

    const canClaimCalls = distributionClaims.map(
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
        canClaimRecord[distributionClaims[index].contractAddress] =
          canClaimRecord[distributionClaims[index].contractAddress] || {}
        canClaimRecord[distributionClaims[index].contractAddress][
          distributionClaims[index].index.toString()
        ] = result.result
      } else {
        throw new Error('Error in multicall reading canClaimDistributions: ' + result.error)
      }
    })

    return canClaimRecord
  }

  async hasClaimedDistributions(
    params: Parameters<IArmadaManagerClaims['hasClaimedDistributions']>[0],
  ): ReturnType<IArmadaManagerClaims['hasClaimedDistributions']> {
    const { distributionClaims, user } = params
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const hasClaimedCalls = distributionClaims.map(
      (claim) =>
        ({
          abi: SummerRewardsRedeemerAbi,
          address: claim.contractAddress,
          functionName: 'hasClaimed',
          args: [user.wallet.address.value, claim.index],
        }) as const,
    )

    const hasClaimedResults = await client.multicall({
      contracts: hasClaimedCalls,
    })

    const hasClaimedPerContract: Record<string, Record<string, boolean>> = {}

    hasClaimedResults.forEach((result, index) => {
      if (result.status === 'success') {
        hasClaimedPerContract[distributionClaims[index].contractAddress] =
          hasClaimedPerContract[distributionClaims[index].contractAddress] || {}
        hasClaimedPerContract[distributionClaims[index].contractAddress][
          distributionClaims[index].index.toString()
        ] = result.result
      } else {
        throw new Error('Error in multicall reading hasClaimedDistributions: ' + result.error)
      }
    })

    return hasClaimedPerContract
  }

  private async getDistributionRewards(user: IUser): Promise<bigint> {
    const distributionClaims = await getAllDistributionClaims({
      distributionsUrls: this._distributionsUrls,
      walletAddress: user.wallet.address.value,
    })

    // filter only claims for the user's chain

    const hasClaimedRecord = await this.hasClaimedDistributions({
      user,
      distributionClaims,
    })

    LoggingService.debug('hasClaimedRecord:', hasClaimedRecord)

    // get distribution rewards amount
    return distributionClaims.reduce((amount, claim) => {
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

    const rewardsManagerAddress = getDeployedGovAddress()
    const rewardToken = this._utils.getSummerToken({ chainInfo: this._hubChainInfo })

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
      functionName: 'earned',
      args: [user.wallet.address.value, rewardToken.address.value],
    })
  }

  private async getStakingV2UserRewards(user: IUser): Promise<bigint> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const rewardToken = this._utils.getSummerToken({ chainInfo: this._hubChainInfo })

    return stakingContract.earned({
      rewardToken: rewardToken.address.value,
      account: user.wallet.address.value,
    })
  }

  async getProtocolUsageRewards(params: {
    userAddressValue: AddressValue
    chainId: ChainId
  }): Promise<{
    total: bigint
    perFleet: Record<string, bigint>
  }> {
    const { userAddressValue, chainId } = params
    const chainInfo = getChainInfoByChainId(chainId)
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo,
    })

    const summerTokenAddress = this._utils.getSummerToken({ chainInfo }).address

    const vaults = await this._subgraphManager.getVaults({ chainId: chainInfo.chainId })
    const fleetCommanderAddresses = vaults.vaults.map((vault) => vault.id as `0x${string}`)
    const stakingRewardsManagerAddresses = vaults.vaults.map((vault) => {
      if ('rewardsManager' in vault) {
        return vault.rewardsManager?.id as `0x${string}` | undefined
      } else {
        return undefined
      }
    })
    // readContract summer token abi

    const contractCalls: {
      abi: typeof StakingRewardsManagerBaseAbi
      address: HexData
      functionName: 'earned'
    }[] = []
    for (let index = 0; index < fleetCommanderAddresses.length; index++) {
      const stakingRewardsManagerAddress = stakingRewardsManagerAddresses[index]
      if (!stakingRewardsManagerAddress) {
        continue
      }
      // read earned staking rewards from rewards manager
      const earnedCall = {
        abi: StakingRewardsManagerBaseAbi,
        address: stakingRewardsManagerAddress,
        functionName: 'earned',
        args: [userAddressValue, summerTokenAddress.value],
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
    const [distributionRewards, voteDelegationRewards, stakingV2Rewards] = await Promise.all([
      this.getDistributionRewards(params.user),
      this.getVoteDelegationRewards(params.user),
      this.getStakingV2UserRewards(params.user),
    ])

    const vaultUsagePerChain: Record<number, bigint> = {}

    await Promise.all(
      this._supportedChains.map(async (chainInfo) => {
        const usageRewards = await this.getProtocolUsageRewards({
          userAddressValue: params.user.wallet.address.toSolidityValue(),
          chainId: chainInfo.chainId,
        })
        vaultUsagePerChain[chainInfo.chainId] = usageRewards.total
        return usageRewards
      }),
    )
    const vaultUsageRewards = Object.values(vaultUsagePerChain).reduce(
      (acc, rewards) => acc + rewards,
      0n,
    )

    const perChainRewards = { ...vaultUsagePerChain }
    perChainRewards[this._hubChainInfo.chainId] +=
      voteDelegationRewards + distributionRewards + stakingV2Rewards

    const totalRewards = Object.values(perChainRewards).reduce((acc, rewards) => acc + rewards, 0n)

    return {
      total: totalRewards,
      perChain: perChainRewards,
      vaultUsagePerChain,
      vaultUsage: vaultUsageRewards,
      stakingV2: stakingV2Rewards,
      distribution: distributionRewards,
      voteDelegation: voteDelegationRewards,
    }
  }

  private calculateTotalClaimableSumrOnMerkl(merklRewards: {
    perChain: Partial<Record<ChainId, MerklReward[]>>
  }): bigint {
    // only on base for now
    const sumrMerklRewards = merklRewards.perChain[ChainIds.Base] || []
    return (
      sumrMerklRewards
        // reduce all SUMR rewards on base chain
        .reduce((sum: bigint, item: MerklReward) => {
          return sum + BigInt(item.amount) - BigInt(item.claimed)
        }, 0n)
    )
  }

  async getAggregatedRewardsIncludingMerkl(
    params: Parameters<IArmadaManagerClaims['getAggregatedRewardsIncludingMerkl']>[0],
  ): ReturnType<IArmadaManagerClaims['getAggregatedRewardsIncludingMerkl']> {
    LoggingService.debug('Aggregated rewards including Merkl')
    const [rewards, userMerklRewards] = await Promise.all([
      this.getAggregatedRewards(params),
      this._merklRewards.getUserMerklRewards({
        address: params.user.wallet.address.value,
      }),
    ])
    LoggingService.debug('Fetched rewards', {
      rewards,
      userMerklRewards,
    })

    // add merkl rewards only on base chain to vaultUsagePerChain
    const merklRewards = this.calculateTotalClaimableSumrOnMerkl(userMerklRewards)
    rewards.vaultUsagePerChain[ChainIds.Base] =
      (rewards.vaultUsagePerChain[ChainIds.Base] || 0n) + merklRewards
    // and perChain
    rewards.perChain[ChainIds.Base] = (rewards.perChain[ChainIds.Base] || 0n) + merklRewards

    // also add merkl rewards to total
    rewards.total += merklRewards

    return rewards
  }

  async getClaimDistributionTx(
    params: Parameters<IArmadaManagerClaims['getClaimDistributionTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimDistributionTx']> {
    const [distributionClaims, canClaimRecord] = await Promise.all([
      getAllDistributionClaims({
        distributionsUrls: this._distributionsUrls,
        walletAddress: params.user.wallet.address.value,
      }),
      this.canClaimDistributions({ user: params.user }),
    ])

    // filter only claims for the user's chain

    const hasClaimedRecord = await this.hasClaimedDistributions({
      user: params.user,
      distributionClaims,
    })

    LoggingService.debug(
      'Claiming distribution claims for ' + params.user.toString(),
      distributionClaims.map(({ amount, index }) => ({ amount, index })),
      'has claimed record: ',
      hasClaimedRecord,
      'can claim record: ',
      canClaimRecord,
    )

    // filter not claimed rewards
    const filteredClaims = distributionClaims.filter((claim) => {
      const hasClaimed = hasClaimedRecord[claim.contractAddress][claim.index.toString()]
      const canClaim = canClaimRecord[claim.contractAddress][claim.index.toString()]
      return !hasClaimed && canClaim && claim.amount > BigInt(0)
    }, 0n)

    // if no claims to process, return empty array
    if (filteredClaims.length === 0) {
      LoggingService.debug('No distribution claims for ' + params.user.toString())
      return
    } else {
      LoggingService.debug(
        'Unclaimed distribution claims for ' + params.user.toString(),
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
        `Processing ${claims.length} distribution claims for contract: ${contractAddress}`,
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
        description: 'Claiming distribution rewards',
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

  async getClaimStakingV2UserRewardsTx(
    params: Parameters<IArmadaManagerClaims['getClaimStakingV2UserRewardsTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimStakingV2UserRewardsTx']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')
    const rewardToken = this._utils.getSummerToken({ chainInfo: this._hubChainInfo }).address

    const calldata = encodeFunctionData({
      abi: SummerStakingAbi,
      functionName: 'getRewardFor',
      args: [params.user.wallet.address.value, rewardToken.value],
    })

    return [
      {
        type: TransactionType.Claim,
        description: 'Claiming staking v2 rewards',
        transaction: {
          target: stakingContractAddress,
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async authorizeStakingRewardsCallerV2(
    params: Parameters<IArmadaManagerClaims['authorizeStakingRewardsCallerV2']>[0],
  ): ReturnType<IArmadaManagerClaims['authorizeStakingRewardsCallerV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const transactionInfo = await stakingContract.setAuthorization({
      authorizedCaller: params.authorizedCaller.value,
      isAuthorized: params.isAuthorized,
    })

    return [
      {
        type: TransactionType.Claim,
        description: transactionInfo.description,
        transaction: {
          target: transactionInfo.transaction.target,
          calldata: transactionInfo.transaction.calldata,
          value: transactionInfo.transaction.value,
        },
      },
    ]
  }

  async isAuthorizedStakingRewardsCallerV2(
    params: Parameters<IArmadaManagerClaims['isAuthorizedStakingRewardsCallerV2']>[0],
  ): ReturnType<IArmadaManagerClaims['isAuthorizedStakingRewardsCallerV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.isAuthorized({
      owner: params.owner.value,
      authorizedCaller: params.authorizedCaller.value,
    })
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
    const govRewardsManagerAddress = getDeployedGovAddress()

    LoggingService.debug(
      `Generating aggregated claim tx on ${params.chainInfo.toString() + (isHubChain ? ' (hub chain)' : '')} for user ${params.user.wallet.address.value}` +
        (params.includeMerkl ? ' including merkl rewards' : '') +
        (params.includeStakingV2 ? ' including staking v2 rewards' : ''),
    )

    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const gatherMulticallArgsFromRequests: Promise<void>[] = []

    if (isHubChain) {
      gatherMulticallArgsFromRequests.push(
        this.getDistributionRewards(params.user).then((distributionRewards) => {
          if (distributionRewards > 0n) {
            LoggingService.debug('Claiming distribution rewards', {
              distributionRewards: distributionRewards,
            })
            return this.getClaimDistributionTx({ user: params.user }).then((distributionTxInfo) => {
              if (!distributionTxInfo) {
                return
              }
              multicallArgs.push(distributionTxInfo[0].transaction.calldata)
              multicallOperations.push('distribution rewards: ' + distributionRewards)
            })
          }
        }),
      )

      // Only include staking v2 rewards if includeStakingV2 flag is true
      if (params.includeStakingV2) {
        gatherMulticallArgsFromRequests.push(
          this.getStakingV2UserRewards(params.user).then(async (stakingV2UserRewards) => {
            if (stakingV2UserRewards > 0n) {
              // Only check authorization if there are rewards to claim
              const isAuthorized = await this.isAuthorizedStakingRewardsCallerV2({
                owner: params.user.wallet.address,
                authorizedCaller: this._deploymentProvider.getDeployedContractAddress({
                  chainId: this._hubChainInfo.chainId,
                  contractName: 'admiralsQuarters',
                }),
              })
              if (!isAuthorized) {
                throw new Error(
                  `AdmiralsQuarters contract is not authorized to claim staking v2 rewards for user ${params.user.toString()}. Please authorize it first.`,
                )
              }

              LoggingService.debug('Claiming staking v2 rewards', {
                stakingV2Rewards: stakingV2UserRewards,
              })
              const summerStakingAddress = getDeployedGovAddress('summerStaking')
              const rewardTokenAddress = this._utils.getSummerToken({
                chainInfo: this._hubChainInfo,
              }).address

              const calldata = encodeFunctionData({
                abi: AdmiralsQuartersAbi,
                functionName: 'claimGovernanceRewards',
                args: [summerStakingAddress.toSolidityValue(), rewardTokenAddress.value],
              })

              multicallArgs.push(calldata)
              multicallOperations.push('staking v2 rewards: ' + stakingV2UserRewards)
            }
          }),
        )
      }

      const govRewardToken = this._utils.getSummerToken({ chainInfo: this._hubChainInfo }).address

      gatherMulticallArgsFromRequests.push(
        this.getVoteDelegationRewards(params.user).then((voteDelegationRewards) => {
          if (voteDelegationRewards > 0n) {
            LoggingService.debug('Claiming governance rewards', {
              voteDelegationRewards,
            })
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

    const fleetRewardToken = this._utils.getSummerToken({ chainInfo: params.chainInfo }).address

    gatherMulticallArgsFromRequests.push(
      this.getProtocolUsageRewards({
        userAddressValue: params.user.wallet.address.toSolidityValue(),
        chainId: params.chainInfo.chainId,
      }).then((protocolUsageRewards) => {
        if (protocolUsageRewards.total > 0n) {
          const fleetCommandersAddresses = Object.entries(protocolUsageRewards.perFleet)
            .filter(([_, rewards]) => rewards > 0n)
            .map(([addressKey]) => Address.createFromEthereum({ value: addressKey }))
          LoggingService.debug(
            'Claiming fleet rewards for fleets:',
            fleetCommandersAddresses.map((a) => a.value),
            'with total rewards:',
            protocolUsageRewards.total,
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

    // if includeMerkl is true, add merkle rewards to the multicall
    if (params.includeMerkl) {
      gatherMulticallArgsFromRequests.push(
        this._merklRewards
          .getUserMerklClaimDirectTx({
            address: params.user.wallet.address.value,
            chainId: params.chainInfo.chainId,
            rewardsTokens: [
              this._utils.getSummerToken({ chainInfo: params.chainInfo }).address.value,
            ],
            useMerklDistributorDirectly: false,
          })
          .then((tx) => {
            if (tx) {
              LoggingService.debug(tx[0].description)
              multicallArgs.push(tx[0].transaction.calldata)
              multicallOperations.push('merkl rewards: ' + tx[0].description)
            }
          }),
      )
    }

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
      multicallArgs.length,
    )

    return [
      {
        type: TransactionType.Claim,
        description:
          'Claiming aggregated rewards' +
          (params.includeMerkl ? ' including merkl rewards: ' : ': ') +
          multicallOperations.join(', '),
        transaction: {
          target: admiralsQuartersAddress,
          calldata: multicallCalldata,
          value: '0',
        },
      },
    ]
  }
}
