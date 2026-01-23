import {
  isTestDeployment,
  type IArmadaManagerMerklRewards,
  type IArmadaManagerUtils,
  type MerklApiRewardBreakdown,
  type MerklApiUsersResponse,
  type MerklReward,
  type MerklRewardBreakdown,
} from '@summerfi/armada-protocol-common'
import {
  isChainId,
  LoggingService,
  getChainInfoByChainId,
  type ChainId,
  type IChainInfo,
  type MerklClaimTransactionInfo,
  type ToggleAQasMerklRewardsOperatorTransactionInfo,
  TransactionType,
  Address,
  type AddressValue,
  ChainIds,
} from '@summerfi/sdk-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { encodeFunctionData } from 'viem'
import { merklClaimAbi } from './abi/merklClaimAbi'
import { merklToggleAbi } from './abi/merklToggleAbi'
import { merklOperatorsAbi } from './abi/merklOperatorsAbi'
import { getMerklDistributorContractAddress } from './configs/merkl-distributor-addresses'
import { AdmiralsQuartersAbi } from '@summerfi/armada-protocol-abis'
import type { IDeploymentProvider } from '../..'
import type { ITokensManager } from '@summerfi/tokens-common'
import { getVaultByMerklCampaignId } from './configs/vaultByMerklCampaignId'
import { BigNumber } from 'bignumber.js'

/**
 * @name ArmadaManagerMerklRewards
 * @description Implementation of the IArmadaManagerMerklRewards interface for managing Merkl rewards
 */
export class ArmadaManagerMerklRewards implements IArmadaManagerMerklRewards {
  private _supportedChainIds: ChainId[]
  private _blockchainClientProvider: IBlockchainClientProvider
  private _deploymentProvider: IDeploymentProvider
  private _tokensManager: ITokensManager

  constructor(params: {
    supportedChains: IChainInfo[]
    blockchainClientProvider: IBlockchainClientProvider
    deploymentProvider: IDeploymentProvider
    tokensManager: ITokensManager
  }) {
    this._supportedChainIds = params.supportedChains.map((chain) => chain.chainId)
    this._blockchainClientProvider = params.blockchainClientProvider
    this._deploymentProvider = params.deploymentProvider
    this._tokensManager = params.tokensManager
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

  async getUserMerklRewards(
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']> {
    const {
      address,
      chainIds = this._supportedChainIds,
      rewardsTokensAddresses = [
        this.getSummerToken({ chainInfo: getChainInfoByChainId(ChainIds.Base) }).address.value,
      ],
    } = params
    const userAddress = address

    try {
      // Build the URL with hardcoded chainId=8453 (Base) as Merkl rewards are only on Base for now
      // using with reloadChainId because we're caching it in the app
      const url = `https://api.merkl.xyz/v4/users/${userAddress}/rewards?chainId=8453&reloadChainId=8453&claimableOnly=false`

      LoggingService.debug('Making request to Merkl API', { url })

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        LoggingService.debug('Merkl API request failed', {
          status: response.status,
          statusText: response.statusText,
          url,
        })
        throw new Error(`Merkl API request failed: ${response.status} ${response.statusText}`)
      }

      const merklApiUsersData = (await response.json()) as MerklApiUsersResponse

      if (!merklApiUsersData || !Array.isArray(merklApiUsersData)) {
        LoggingService.debug('Invalid response from Merkl API', { data: merklApiUsersData })
        throw new Error('Invalid response from Merkl API')
      }

      // Map response to our interface, picking only required properties
      const merklRewardsPerChain: Partial<Record<ChainId, MerklReward[]>> = {}

      // Pre-normalize rewardsTokensAddresses to lowercase Set for case-insensitive comparison
      const normalizedRewardsTokensSet = rewardsTokensAddresses
        ? new Set(rewardsTokensAddresses.map((address) => address.toLowerCase()))
        : null

      LoggingService.debug('merklApiUsersData', {
        merklApiUsersData,
      })

      merklApiUsersData.forEach((merklApiUser) => {
        const rewards: MerklReward[] = []
        // parsing user rewards
        for (const reward of merklApiUser.rewards) {
          // check if reward.token.address is in requested rewardsTokensAddresses
          if (
            normalizedRewardsTokensSet &&
            !normalizedRewardsTokensSet.has(reward.token.address.toLowerCase())
          ) {
            continue
          }
          const parsedBreakdowns = this._parseBreakdowns(reward.breakdowns, chainIds)
          rewards.push({
            token: reward.token,
            root: reward.root,
            recipient: reward.recipient,
            amount: reward.amount,
            claimed: reward.claimed,
            pending: reward.pending,
            proofs: reward.proofs,
            breakdowns: parsedBreakdowns.resultByChain,
            unknownCampaigns: parsedBreakdowns.unknownCampaigns,
          })
        }

        if (!merklRewardsPerChain[ChainIds.Base]) {
          merklRewardsPerChain[ChainIds.Base] = []
        }
        merklRewardsPerChain[ChainIds.Base]!.push(...rewards)
      })

      LoggingService.debug(
        'Successfully parsed Merkl rewards data',
        normalizedRewardsTokensSet,
        Object.entries(merklRewardsPerChain).map(([chainId, rewards]) =>
          JSON.stringify({
            chainId,
            rewards: rewards.map((reward) => ({
              token: reward.token.symbol,
              // use BigNumber for arithmetic/formatting instead of BigInt operations
              amount: new BigNumber(reward.amount)
                .div(new BigNumber(10).pow(reward.token.decimals))
                .toFixed(3),
              claimed: new BigNumber(reward.claimed)
                .div(new BigNumber(10).pow(reward.token.decimals))
                .toFixed(3),
              unknownCampaignsAmount: reward.unknownCampaigns
                .map((c) => c.amount)
                .reduce((a, b) => a.plus(b), new BigNumber(0))
                .div(new BigNumber(10).pow(reward.token.decimals))
                .toFixed(3),
              unknownCampaignsClaimed: reward.unknownCampaigns
                .map((c) => c.claimed)
                .reduce((a, b) => a.plus(b), new BigNumber(0))
                .div(new BigNumber(10).pow(reward.token.decimals))
                .toFixed(3),
              breakdowns: Object.entries(reward.breakdowns).map(([chainId, breakdowns]) => ({
                chainId,
                breakdowns: Object.entries(breakdowns).length,
              })),
            })),
          }),
        ),
      )

      return { perChain: merklRewardsPerChain }
    } catch (error) {
      LoggingService.debug('Failed to fetch Merkl rewards', {
        address: userAddress,
        chainIds: chainIds,
        error: error instanceof Error ? error.message : String(error),
      })
      throw new Error(
        `Failed to fetch Merkl rewards: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  private _parseBreakdowns(
    breakdowns: MerklApiRewardBreakdown[],
    chainIds: ChainId[],
  ): {
    resultByChain: Record<ChainId, Record<AddressValue, MerklRewardBreakdown>>
    unknownCampaigns: MerklApiRewardBreakdown[]
  } {
    const resultByChain = Object.values(this._supportedChainIds).reduce(
      (acc, chainId) => {
        acc[chainId as ChainId] = {}
        return acc
      },
      {} as Record<ChainId, Record<AddressValue, MerklRewardBreakdown>>,
    )

    LoggingService.debug('Parsing breakdown', {
      breakdownsCount: breakdowns.length,
      breakdowns: breakdowns,
    })

    const unknownCampaigns: MerklApiRewardBreakdown[] = []

    // aggregate breakdowns by chainId and fleetAddress
    for (const breakdown of breakdowns) {
      const vault = getVaultByMerklCampaignId(breakdown.campaignId)

      // If campaign ID is unknown, log to unknowns
      if (!vault) {
        LoggingService.debug('Unknown Merkl campaign ID in breakdown', {
          campaignId: breakdown.campaignId,
        })
        unknownCampaigns.push(breakdown)
        continue
      }

      const { chainId, fleetAddress } = vault
      if (!isChainId(chainId) || !chainIds.includes(chainId)) {
        // Skip unsupported or unrequested chain IDs
        continue
      }
      const perChain = (resultByChain[chainId] ||= {} as Record<AddressValue, MerklRewardBreakdown>)

      // Normalize fleet address to ensure consistent key usage
      const rewardSourceKey = fleetAddress.toLowerCase() as AddressValue
      // Ensure perChain map exists for this chainId
      const prev = perChain[rewardSourceKey]
      const amount = prev
        ? new BigNumber(prev.amount).plus(breakdown.amount)
        : new BigNumber(breakdown.amount)
      const claimed = prev
        ? new BigNumber(prev.claimed).plus(breakdown.claimed)
        : new BigNumber(breakdown.claimed)
      const pending = prev
        ? new BigNumber(prev.pending).plus(breakdown.pending)
        : new BigNumber(breakdown.pending)
      perChain[rewardSourceKey] = {
        amount: amount.toFixed(),
        claimed: claimed.toFixed(),
        pending: pending.toFixed(),
      }
    }
    return { resultByChain, unknownCampaigns }
  }

  async getUserMerklClaimDirectTx(
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklClaimDirectTx']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getUserMerklClaimDirectTx']> {
    const { address } = params

    const chainId = ChainIds.Base // Merkl rewards are only on Base for now

    LoggingService.debug('Generating getUserMerklClaimDirectTx', {
      address,
      chainId,
    })

    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId,
      contractName: 'admiralsQuarters',
    })

    const claimTarget = params.useMerklDistributorDirectly
      ? getMerklDistributorContractAddress(chainId)
      : admiralsQuartersAddress.value

    // Get user's Merkl rewards for this specific chain
    const rewardsData = await this.getUserMerklRewards({
      address,
    })

    const chainRewards = rewardsData.perChain[chainId]
    if (!chainRewards || chainRewards.length === 0) {
      LoggingService.debug('Transaction generation skipped, no claimable Merkl rewards', {
        address,
        chainId,
      })
      return undefined
    }

    // Prepare arrays for the claim function
    let processed = 0
    const users: `0x${string}`[] = []
    const tokens: `0x${string}`[] = []
    const amounts: bigint[] = []
    const proofs: `0x${string}`[][] = []

    for (const reward of chainRewards) {
      if (
        params.rewardsTokens &&
        !params.rewardsTokens.includes(reward.token.address as `0x${string}`)
      ) {
        LoggingService.debug(
          `Skipping reward in token ${reward.token.address} not matching any of ${params.rewardsTokens}`,
        )
        continue
      }
      users.push(address as `0x${string}`)
      tokens.push(reward.token.address as `0x${string}`)
      amounts.push(BigInt(reward.amount))
      proofs.push(reward.proofs as `0x${string}`[])
      processed++
    }
    if (processed === 0) {
      LoggingService.debug('No matching rewards found', params.rewardsTokens)
      return undefined
    } else {
      LoggingService.debug('Found matching rewards', {
        users,
        tokens,
        amounts,
        proofs,
      })
    }

    // Encode the claim function call
    const calldata = params.useMerklDistributorDirectly
      ? encodeFunctionData({
          abi: merklClaimAbi,
          functionName: 'claim',
          args: [users, tokens, amounts, proofs],
        })
      : encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'claimFromMerklDistributor',
          args: [users, tokens, amounts, proofs],
        })

    const merklClaimTx: MerklClaimTransactionInfo = {
      type: TransactionType.MerklClaim,
      description:
        'Claiming Merkl rewards' +
        (params.useMerklDistributorDirectly ? ' directly' : ' via AdmiralsQuarters'),
      transaction: {
        target: Address.createFromEthereum({ value: claimTarget }),
        calldata: calldata,
        value: '0',
      },
    }

    LoggingService.debug('Generated Merkl claim transaction', {
      rewardsCount: chainRewards.length,
      target: claimTarget,
    })

    return [merklClaimTx]
  }

  async getUserMerklClaimTx(
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklClaimTx']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getUserMerklClaimTx']> {
    const { address, chainId } = params

    const claimTx = await this.getUserMerklClaimDirectTx({
      address,
      chainId,
      rewardsTokens: [
        this.getSummerToken({ chainInfo: getChainInfoByChainId(chainId) }).address.value,
      ],
      useMerklDistributorDirectly: false,
    })
    if (!claimTx) {
      return undefined
    }

    const multicallMerklClaimTx: MerklClaimTransactionInfo = {
      type: claimTx[0].type,
      description: claimTx[0].description,
      transaction: {
        target: claimTx[0].transaction.target,
        calldata: encodeFunctionData({
          abi: AdmiralsQuartersAbi,
          functionName: 'multicall',
          args: [[claimTx[0].transaction.calldata]],
        }),
        value: claimTx[0].transaction.value,
      },
    }

    return [multicallMerklClaimTx]
  }

  async getReferralFeesMerklClaimTx(
    params: Parameters<IArmadaManagerMerklRewards['getReferralFeesMerklClaimTx']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getReferralFeesMerklClaimTx']> {
    const { address, chainId, rewardsTokensAddresses } = params

    const claimTx = await this.getUserMerklClaimDirectTx({
      address,
      chainId,
      rewardsTokens: rewardsTokensAddresses,
      useMerklDistributorDirectly: true,
    })
    if (!claimTx) {
      return undefined
    }

    const multicallMerklClaimTx: MerklClaimTransactionInfo = {
      type: claimTx[0].type,
      description: claimTx[0].description,
      transaction: {
        target: claimTx[0].transaction.target,
        calldata: claimTx[0].transaction.calldata,
        value: claimTx[0].transaction.value,
      },
    }

    return [multicallMerklClaimTx]
  }

  async getAuthorizeAsMerklRewardsOperatorTx(
    params: Parameters<IArmadaManagerMerklRewards['getAuthorizeAsMerklRewardsOperatorTx']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getAuthorizeAsMerklRewardsOperatorTx']> {
    const { chainId, user } = params

    LoggingService.debug('Generating authorize AQ as Merkl rewards operator transaction', {
      chainId,
      user,
    })

    // Validate chain ID is supported and get distributor address
    const distributorAddress = getMerklDistributorContractAddress(chainId)

    // Get AdmiralsQuarters contract address
    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId,
      contractName: 'admiralsQuarters',
    })

    if (!admiralsQuartersAddress) {
      throw new Error(`AdmiralsQuarters contract not found for chain ID: ${chainId}`)
    }

    // Encode the toggleOperator function call
    const calldata = encodeFunctionData({
      abi: merklToggleAbi,
      functionName: 'toggleOperator',
      args: [user, admiralsQuartersAddress.value],
    })

    const toggleTx: ToggleAQasMerklRewardsOperatorTransactionInfo = {
      type: TransactionType.ToggleAQasMerklRewardsOperator,
      description: 'Authorize AdmiralsQuarters as Merkl rewards operator',
      transaction: {
        target: Address.createFromEthereum({ value: distributorAddress }),
        calldata: calldata,
        value: '0',
      },
    }

    LoggingService.debug('Generated authorize AQ as Merkl rewards operator transaction', {
      target: distributorAddress,
      operator: admiralsQuartersAddress.value,
    })

    return [toggleTx]
  }

  async getIsAuthorizedAsMerklRewardsOperator(
    params: Parameters<IArmadaManagerMerklRewards['getIsAuthorizedAsMerklRewardsOperator']>[0],
  ): ReturnType<IArmadaManagerMerklRewards['getIsAuthorizedAsMerklRewardsOperator']> {
    const { chainId, user } = params

    LoggingService.debug('Checking AdmiralsQuarters authorization as Merkl rewards operator', {
      chainId,
      user,
    })

    // Validate chain ID is supported and get distributor address
    const distributorAddress = getMerklDistributorContractAddress(chainId)

    // Get AdmiralsQuarters contract address
    const admiralsQuartersAddress = this._deploymentProvider.getDeployedContractAddress({
      chainId,
      contractName: 'admiralsQuarters',
    })

    if (!admiralsQuartersAddress) {
      throw new Error(`AdmiralsQuarters contract not found for chain ID: ${chainId}`)
    }

    // Get blockchain client
    const chainInfo = getChainInfoByChainId(chainId)
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo,
    })

    // Read authorization status from contract
    const isAuthorized = await client.readContract({
      abi: merklOperatorsAbi,
      address: distributorAddress,
      functionName: 'operators',
      args: [user, admiralsQuartersAddress.value],
    })

    LoggingService.debug('AdmiralsQuarters authorization check completed', {
      chainId,
      user,
      isAuthorized,
      operator: admiralsQuartersAddress.value,
    })

    return isAuthorized
  }
}
