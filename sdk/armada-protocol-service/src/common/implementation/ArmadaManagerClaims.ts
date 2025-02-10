import {
  AdmiralsQuartersAbi,
  GovernanceRewardsManagerAbi,
  HarborCommandAbi,
  StakingRewardsManagerBaseAbi,
  SummerRewardsRedeemerAbi,
} from '@summerfi/armada-protocol-abis'
import {
  type IArmadaManagerClaims,
  getAllMerkleClaims,
  getDeployedContractAddress,
  getDeployedGovRewardsManagerAddress,
} from '@summerfi/armada-protocol-common'
import {
  Address,
  LoggingService,
  TransactionType,
  type HexData,
  type IAddress,
  type IChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'
import { encodeFunctionData } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerClaims implements IArmadaManagerClaims {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _contractsProvider: IContractsProvider
  private _configProvider: IConfigurationProvider
  private _getSummerToken: (params: { chainInfo: IChainInfo }) => IToken

  private _supportedChains: IChainInfo[]
  private _hubChainInfo: IChainInfo
  private _rewardsRedeemerAddress: IAddress
  private _distributionsUrls: string[]

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    contractsProvider: IContractsProvider
    configProvider: IConfigurationProvider
    supportedChains: IChainInfo[]
    hubChainInfo: IChainInfo
    rewardsRedeemerAddress: IAddress
    getSummerToken: (params: { chainInfo: IChainInfo }) => IToken
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._contractsProvider = params.contractsProvider
    this._configProvider = params.configProvider
    this._supportedChains = params.supportedChains
    this._hubChainInfo = params.hubChainInfo
    this._rewardsRedeemerAddress = params.rewardsRedeemerAddress
    this._getSummerToken = params.getSummerToken

    const _distributionsBaseUrl = this._configProvider.getConfigurationItem({
      name: 'SDK_DISTRIBUTIONS_BASE_URL',
    })

    this._distributionsUrls = this._configProvider
      .getConfigurationItem({
        name: 'SDK_DISTRIBUTIONS_FILES',
      })
      .split(',')
      .map((file) => `${_distributionsBaseUrl.trim()}/${file.trim()}`)
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
          address: this._rewardsRedeemerAddress.value,
          functionName: 'canClaim',
          args: [params.user.wallet.address.value, claim.index, claim.amount, claim.proof],
        }) as const,
    )

    const canClaimResults = await client.multicall({
      contracts: canClaimCalls,
    })

    const canClaimRecord: Record<string, boolean> = {}

    canClaimResults.forEach((result, index) => {
      if (result.status === 'success') {
        canClaimRecord[merkleClaims[index].index.toString()] = result.result
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
          address: this._rewardsRedeemerAddress.value,
          functionName: 'hasClaimed',
          args: [params.user.wallet.address.value, claim.index],
        }) as const,
    )

    const hasClaimedResults = await client.multicall({
      contracts: hasClaimedCalls,
    })

    const hasClaimedRecord: Record<string, boolean> = {}

    hasClaimedResults.forEach((result, index) => {
      if (result.status === 'success') {
        hasClaimedRecord[merkleClaims[index].index.toString()] = result.result
      } else {
        throw new Error('Error in multicall reading hasClaimedDistributions: ' + result.error)
      }
    })

    return hasClaimedRecord
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
      if (hasClaimedRecord[claim.index.toString()]) {
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
    const rewardToken = this._getSummerToken({ chainInfo: this._hubChainInfo })

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
      functionName: 'earned',
      args: [user.wallet.address.value, rewardToken.address.value],
    })
  }

  // TODO optimise stakingRewardsManager addresses to config
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

    const summerTokenAddress = getDeployedContractAddress({
      chainInfo,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })

    const harborCommandAddress = getDeployedContractAddress({
      chainInfo,
      contractCategory: 'core',
      contractName: 'harborCommand',
    })

    // readContract summer token abi
    const fleetCommanderAddresses = await client.readContract({
      abi: HarborCommandAbi,
      address: harborCommandAddress.value,
      functionName: 'getActiveFleetCommanders',
    })

    const contractCalls: {
      abi: typeof StakingRewardsManagerBaseAbi
      address: HexData
      functionName: 'earned'
    }[] = []
    for await (const fleetCommanderAddress of fleetCommanderAddresses) {
      // read earned staking rewards from rewards manager
      const fleetContract = await this._contractsProvider.getFleetCommanderContract({
        chainInfo,
        address: Address.createFromEthereum({ value: fleetCommanderAddress }),
      })
      const { stakingRewardsManager } = await fleetContract.config()
      const earnedCall = {
        abi: StakingRewardsManagerBaseAbi,
        address: stakingRewardsManager.value,
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

    LoggingService.debug(`Read protocol rewards on ` + chainInfo.toString(), perFleet)

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

    let protocolUsageRewards = 0n
    const perChainRewards = await Promise.all(
      this._supportedChains.map(async (chainInfo) => {
        const rewards = await this.getProtocolUsageRewards(params.user, chainInfo)
        if (chainInfo.chainId === this._hubChainInfo.chainId) {
          // on hubchain we add delegation and distribution rewards
          perChain[chainInfo.chainId] =
            rewards.total + voteDelegationRewards + merkleDistributionRewards
        } else {
          // on other chains we add only protocol usage rewards
          perChain[chainInfo.chainId] = rewards.total
        }
        return rewards
      }),
    )
    protocolUsageRewards = perChainRewards.reduce((acc, rewards) => acc + rewards.total, 0n)

    const total = merkleDistributionRewards + voteDelegationRewards + protocolUsageRewards

    return {
      total,
      perChain,
    }
  }

  async getClaimDistributionTx(
    params: Parameters<IArmadaManagerClaims['getClaimDistributionTx']>[0],
  ): ReturnType<IArmadaManagerClaims['getClaimDistributionTx']> {
    const [merkleClaims, hasClaimedRecord] = await Promise.all([
      getAllMerkleClaims({
        distributionsUrls: this._distributionsUrls,
        walletAddress: params.user.wallet.address.value,
      }),
      this.hasClaimedDistributions({ user: params.user }),
    ])

    // filter not claimed rewards
    const filteredClaims = merkleClaims.filter((claim) => {
      return !hasClaimedRecord[claim.index.toString()]
    }, 0n)

    LoggingService.debug(
      'Filtered claims for user: ' + params.user.toString(),
      filteredClaims.map(({ amount, index }) => ({ amount, index })),
    )

    const indices = filteredClaims.map((claim) => claim.index)
    const amounts = filteredClaims.map((claim) => claim.amount)
    const proofs = filteredClaims.map((claim) => claim.proof)

    const calldata = encodeFunctionData({
      abi: AdmiralsQuartersAbi,
      functionName: 'claimMerkleRewards',
      args: [
        params.user.wallet.address.value,
        indices,
        amounts,
        proofs,
        this._rewardsRedeemerAddress.value,
      ],
    })

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: this._hubChainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    return [
      {
        type: TransactionType.Claim,
        description: 'Claiming merkle rewards',
        transaction: {
          target: admiralsQuartersAddress,
          calldata: calldata,
          value: '0',
        },
      },
    ]
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
      chainInfo: this._hubChainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
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

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.chainInfo,
      contractCategory: 'core',
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

  async getAggregatedClaimsForChainTX(
    params: Parameters<IArmadaManagerClaims['getAggregatedClaimsForChainTX']>[0],
  ): ReturnType<IArmadaManagerClaims['getAggregatedClaimsForChainTX']> {
    const isHubChain = params.chainInfo.chainId === this._hubChainInfo.chainId

    const govRewardsManagerAddress = getDeployedGovRewardsManagerAddress()

    const multicallArgs: HexData[] = []
    const multicallOperations: string[] = []

    const requests: Promise<void>[] = []

    if (isHubChain) {
      requests.push(
        this.getMerkleDistributionRewards(params.user).then((merkleDistributionRewards) => {
          if (merkleDistributionRewards > 0n) {
            return this.getClaimDistributionTx({ user: params.user }).then((claimMerkleRewards) => {
              multicallArgs.push(claimMerkleRewards[0].transaction.calldata)
              multicallOperations.push('merkle rewards: ' + merkleDistributionRewards)
            })
          }
        }),
      )

      const govRewardToken = getDeployedContractAddress({
        chainInfo: this._hubChainInfo,
        contractCategory: 'gov',
        contractName: 'summerToken',
      })

      requests.push(
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

    const fleetRewardToken = getDeployedContractAddress({
      chainInfo: params.chainInfo,
      contractCategory: 'gov',
      contractName: 'summerToken',
    })

    requests.push(
      this.getProtocolUsageRewards(params.user, params.chainInfo).then((protocolUsageRewards) => {
        if (protocolUsageRewards.total > 0n) {
          const fleetCommandersAddresses = Object.entries(protocolUsageRewards.perFleet)
            .filter(([_, rewards]) => rewards > 0n)
            .map(([addressKey]) => Address.createFromEthereum({ value: addressKey }))
          LoggingService.debug(
            'Claiming only for the fleets with rewards:',
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

    await Promise.all(requests)

    const admiralsQuartersAddress = getDeployedContractAddress({
      chainInfo: params.chainInfo,
      contractCategory: 'core',
      contractName: 'admiralsQuarters',
    })

    if (multicallArgs.length === 0) {
      return undefined
    }

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
