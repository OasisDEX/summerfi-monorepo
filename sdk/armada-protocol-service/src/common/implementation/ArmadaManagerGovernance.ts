import {
  GovernanceRewardsManagerAbi,
  SummerStakingAbi,
  SummerTokenAbi,
} from '@summerfi/armada-protocol-abis'
import {
  getDeployedGovAddress,
  type IArmadaManagerGovernance,
  type IArmadaManagerUtils,
  type StakingBucketInfo,
  type UserStakingBalanceByBucket,
  isTestDeployment,
} from '@summerfi/armada-protocol-common'
import {
  Address,
  StakingBucket,
  StakingBucketValues,
  TokenAmount,
  TransactionType,
  Percentage,
  type IAddress,
  type IChainInfo,
} from '@summerfi/sdk-common'
import { encodeFunctionData, zeroAddress } from 'viem'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import { findBucket } from './findBucket'
import { BigNumber } from 'bignumber.js'

const MAX_MULTIPLE = 7.2655

/**
 * @name ArmadaManager
 * @description This class is the implementation of the IArmadaManager interface. Takes care of choosing the best provider for a price consultation
 */
export class ArmadaManagerGovernance implements IArmadaManagerGovernance {
  private _blockchainClientProvider: IBlockchainClientProvider
  private _allowanceManager: IAllowanceManager
  private _tokensManager: ITokensManager
  private _contractsProvider: IContractsProvider
  private _utils: IArmadaManagerUtils
  private _vaults: import('@summerfi/armada-protocol-common').IArmadaManagerVaults

  private _hubChainSummerTokenAddress: IAddress
  private _hubChainInfo: IChainInfo

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClientProvider: IBlockchainClientProvider
    allowanceManager: IAllowanceManager
    tokensManager: ITokensManager
    contractsProvider: IContractsProvider
    hubChainInfo: IChainInfo
    utils: IArmadaManagerUtils
    vaults: import('@summerfi/armada-protocol-common').IArmadaManagerVaults
  }) {
    this._blockchainClientProvider = params.blockchainClientProvider
    this._allowanceManager = params.allowanceManager
    this._tokensManager = params.tokensManager
    this._contractsProvider = params.contractsProvider
    this._hubChainInfo = params.hubChainInfo
    this._utils = params.utils
    this._vaults = params.vaults

    const tokenSymbol = isTestDeployment() ? 'BUMMER' : 'SUMR'

    this._hubChainSummerTokenAddress = this._tokensManager.getTokenBySymbol({
      chainInfo: this._hubChainInfo,
      symbol: tokenSymbol,
    }).address
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

    const rewardsManagerAddress = getDeployedGovAddress()

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
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

    const rewardsManagerAddress = getDeployedGovAddress()

    // for now reward token is just summer token
    // in future potential partners can be added
    const rewardToken = this._hubChainSummerTokenAddress

    return client.readContract({
      abi: GovernanceRewardsManagerAbi,
      address: rewardsManagerAddress.value,
      functionName: 'earned',
      args: [params.user.wallet.address.value, rewardToken.value],
    })
  }

  private async _getStakeTx(
    params: Parameters<IArmadaManagerGovernance['getStakeTx']>[0],
    rewardsManagerAddress: IAddress,
  ): ReturnType<IArmadaManagerGovernance['getStakeTx']> {
    const calldata = encodeFunctionData({
      abi: GovernanceRewardsManagerAbi,
      functionName: 'stake',
      args: [params.amount],
    })

    const stakeTx = {
      type: TransactionType.Stake,
      description: 'Staking tokens',
      transaction: {
        target: rewardsManagerAddress,
        calldata: calldata,
        value: '0',
      },
    } as const

    const approveToStakeUserTokens = await this._allowanceManager.getApproval({
      chainInfo: this._hubChainInfo,
      spender: rewardsManagerAddress,
      amount: TokenAmount.createFromBaseUnit({
        amount: params.amount.toString(),
        token: this._utils.getSummerToken({
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

  private async _getUnstakeTx(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTx']>[0],
    rewardsManagerAddress: IAddress,
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTx']> {
    const calldata = encodeFunctionData({
      abi: GovernanceRewardsManagerAbi,
      functionName: 'unstake',
      args: [params.amount],
    })

    return [
      {
        type: TransactionType.Unstake,
        description: 'Unstaking tokens',
        transaction: {
          target: rewardsManagerAddress,
          calldata: calldata,
          value: '0',
        },
      },
    ]
  }

  async getStakeTx(
    params: Parameters<IArmadaManagerGovernance['getStakeTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeTx']> {
    const rewardsManagerAddress = getDeployedGovAddress()
    return this._getStakeTx(params, rewardsManagerAddress)
  }

  async getUnstakeTx(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTx']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTx']> {
    const rewardsManagerAddress = getDeployedGovAddress()
    return this._getUnstakeTx(params, rewardsManagerAddress)
  }

  async getDelegationChainLength(
    params: Parameters<IArmadaManagerGovernance['getDelegationChainLength']>[0],
  ): ReturnType<IArmadaManagerGovernance['getDelegationChainLength']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const length = await client.readContract({
      abi: SummerTokenAbi,
      address: this._hubChainSummerTokenAddress.value,
      functionName: 'getDelegationChainLength',
      args: [params.user.wallet.address.value],
    })
    const num = Number(length.toString())
    if (!Number.isSafeInteger(num)) {
      throw new Error('Delegation chain length exceeds safe integer limits')
    }
    return num
  }

  async getStakeTxV2(
    params: Parameters<IArmadaManagerGovernance['getStakeTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeTxV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const stakeTxInfo = await stakingContract.stakeLockup({
      amount: params.amount,
      lockupPeriod: params.lockupPeriod,
    })

    const stakeTx = {
      type: TransactionType.Stake,
      description: stakeTxInfo.description,
      transaction: stakeTxInfo.transaction,
    } as const

    const approveToStakeUserTokens = await this._allowanceManager.getApproval({
      chainInfo: this._hubChainInfo,
      spender: stakingContractAddress,
      amount: TokenAmount.createFromBaseUnit({
        amount: params.amount.toString(),
        token: this._utils.getSummerToken({
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

  async getStakeOnBehalfTxV2(
    params: Parameters<IArmadaManagerGovernance['getStakeOnBehalfTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakeOnBehalfTxV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const stakeTxInfo = await stakingContract.stakeLockupOnBehalf({
      receiver: params.receiver.value,
      amount: params.amount,
      lockupPeriod: params.lockupPeriod,
    })

    const stakeTx = {
      type: TransactionType.Stake,
      description: stakeTxInfo.description,
      transaction: stakeTxInfo.transaction,
    } as const

    const approveToStakeUserTokens = await this._allowanceManager.getApproval({
      chainInfo: this._hubChainInfo,
      spender: stakingContractAddress,
      amount: TokenAmount.createFromBaseUnit({
        amount: params.amount.toString(),
        token: this._utils.getSummerToken({
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

  async getUnstakeTxV2(
    params: Parameters<IArmadaManagerGovernance['getUnstakeTxV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUnstakeTxV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    const unstakeTxInfo = await stakingContract.unstakeLockup({
      stakeIndex: params.userStakeIndex,
      amount: params.amount,
    })

    return [
      {
        type: TransactionType.Unstake,
        description: unstakeTxInfo.description,
        transaction: unstakeTxInfo.transaction,
      },
    ]
  }

  async getUserStakingBalanceV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakingBalanceV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingBalanceV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get the count of user stakes
    const stakesCount = await stakingContract.getUserStakesCount({
      user: params.user.wallet.address.value,
    })

    if (stakesCount === 0n) {
      // Return empty array with zero balances for all buckets
      return StakingBucketValues.map((bucket) => ({ bucket: bucket as StakingBucket, amount: 0n }))
    }

    // Fetch all user stakes
    const stakesPromises = []
    for (let i = 0n; i < stakesCount; i++) {
      stakesPromises.push(
        stakingContract.getUserStake({
          user: params.user.wallet.address.value,
          index: i,
        }),
      )
    }

    const stakesResults = await Promise.all(stakesPromises)

    // Initialize buckets with zero balances
    const bucketBalances = new Map<StakingBucket, bigint>()
    for (const bucket of StakingBucketValues) {
      bucketBalances.set(bucket as StakingBucket, 0n)
    }

    // Aggregate stakes by bucket
    stakesResults.forEach((result) => {
      const [amount, , , lockupPeriod] = result
      const bucket = findBucket(lockupPeriod)
      bucketBalances.set(bucket, (bucketBalances.get(bucket) || 0n) + amount)
    })

    // Convert to array format
    const resultArray: UserStakingBalanceByBucket[] = []
    for (const [bucket, amount] of bucketBalances.entries()) {
      resultArray.push({ bucket, amount })
    }

    return resultArray
  }

  async getUserStakingWeightedBalanceV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakingWeightedBalanceV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingWeightedBalanceV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.weightedBalanceOf({
      account: params.user.wallet.address.value,
    })
  }

  async getUserStakingEarnedV2(
    params: Parameters<IArmadaManagerGovernance['getUserStakingEarnedV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getUserStakingEarnedV2']> {
    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: this._hubChainInfo,
    })

    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    return client.readContract({
      abi: SummerStakingAbi,
      address: stakingContractAddress.value,
      functionName: 'earned',
      args: [params.user.wallet.address.value, params.rewardTokenAddress.value],
    })
  }

  async getStakingRewardRatesV2(
    params: Parameters<IArmadaManagerGovernance['getStakingRewardRatesV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakingRewardRatesV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Use contract wrapper for all methods
    const [rewardData, allBucketInfo, userWeightedBalance, _totalWeightedSupply, userRawBalance] =
      await Promise.all([
        stakingContract.rewardData({ rewardToken: params.rewardTokenAddress.value }),
        stakingContract.getAllBucketInfo(),
        stakingContract.weightedBalanceOf({ account: params.user.wallet.address.value }),
        stakingContract.totalSupply(),
        stakingContract.balanceOf({ account: params.user.wallet.address.value }),
      ])

    const [, , stakedAmounts] = allBucketInfo

    // Calculate total raw staked across all buckets
    const totalRawStaked = stakedAmounts.reduce((sum: bigint, amount: bigint) => sum + amount, 0n)

    const [, rewardRate] = rewardData
    const SECONDS_PER_YEAR = 365n * 24n * 60n * 60n

    // Calculate annual rewards
    const annualRewards = rewardRate * SECONDS_PER_YEAR

    // Calculate APR (Annual Percentage Rate) based on raw staked
    let summerRewardAPR = 0
    if (totalRawStaked > 0n) {
      // APR = (annualRewards / totalRawStaked)
      // Convert to percentage with precision using BigNumber
      const annualRewardsBN = new BigNumber(annualRewards.toString())
      const totalRawStakedBN = new BigNumber(totalRawStaked.toString())
      summerRewardAPR = annualRewardsBN.dividedBy(totalRawStakedBN).multipliedBy(100).toNumber()
    }

    // Convert APR to APY (compounding daily)
    // APY = (1 + APR/365)^365 - 1
    const compoundingFrequency = 365
    const summerRewardAPY =
      Math.pow(1 + summerRewardAPR / 100 / compoundingFrequency, compoundingFrequency) - 1

    // Calculate user's boosted multiplier: weightedBalanceOf(user) / balanceOf(user)
    let boostedMultiplier = 1
    if (userRawBalance > 0n) {
      // Convert to number with precision using BigNumber
      const userWeightedBalanceBN = new BigNumber(userWeightedBalance.toString())
      const userRawBalanceBN = new BigNumber(userRawBalance.toString())
      boostedMultiplier = userWeightedBalanceBN.dividedBy(userRawBalanceBN).toNumber()
    }

    // Get staking revenue share to calculate baseApy
    const revenueShare = await this.getStakingRevenueShareV2()
    const stakingRevenueAmount = revenueShare.amount // in USD

    // Get SUMR token and its decimals
    const sumrToken = this._utils.getSummerToken({
      chainInfo: this._hubChainInfo,
    })
    const sumrDecimals = sumrToken.decimals

    // Get SUMR price from utils
    const sumrPrice = this._utils.getSummerPrice()

    let baseApy = 0
    let maxApy = 0

    if (totalRawStaked > 0n && stakingRevenueAmount > 0 && sumrPrice > 0) {
      // Convert totalRawStaked from wei to token amount using actual decimals
      const totalRawStakedTokens = new BigNumber(totalRawStaked.toString()).dividedBy(
        new BigNumber(10).pow(sumrDecimals),
      )

      // baseApy = staking revenue amount / staked sumr value
      const stakedSumrValue = new BigNumber(sumrPrice).multipliedBy(totalRawStakedTokens)
      baseApy = new BigNumber(stakingRevenueAmount)
        .dividedBy(stakedSumrValue)
        .multipliedBy(100)
        .toNumber() // Convert to percentage

      // maxApy = baseApy * MAX_MULTIPLE
      maxApy = baseApy * MAX_MULTIPLE
    }

    return {
      summerRewardAPY: summerRewardAPY * 100, // Convert to percentage
      boostedMultiplier,
      baseApy,
      maxApy,
    }
  }

  async getStakingBucketsInfoV2(): ReturnType<IArmadaManagerGovernance['getStakingBucketsInfoV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get all bucket info at once
    const allBucketInfo = await stakingContract.getAllBucketInfo()

    const [buckets, caps, stakedAmounts, minPeriods, maxPeriods] = allBucketInfo

    const result: StakingBucketInfo[] = []
    for (let i = 0; i < buckets.length; i++) {
      result.push({
        bucket: buckets[i] as StakingBucket,
        cap: caps[i],
        totalStaked: stakedAmounts[i],
        minLockupPeriod: minPeriods[i],
        maxLockupPeriod: maxPeriods[i],
      })
    }

    return result
  }

  async getStakingCalculateWeightedStakeV2(
    params: Parameters<IArmadaManagerGovernance['getStakingCalculateWeightedStakeV2']>[0],
  ): ReturnType<IArmadaManagerGovernance['getStakingCalculateWeightedStakeV2']> {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.calculateWeightedStake({
      amount: params.amount,
      lockupPeriod: params.lockupPeriod,
    })
  }

  async getStakingTotalWeightedSupplyV2(): ReturnType<
    IArmadaManagerGovernance['getStakingTotalWeightedSupplyV2']
  > {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    return stakingContract.totalSupply()
  }

  async getStakingTotalSumrStakedV2(): ReturnType<
    IArmadaManagerGovernance['getStakingTotalSumrStakedV2']
  > {
    const stakingContractAddress = getDeployedGovAddress('summerStaking')

    const stakingContract = await this._contractsProvider.getSummerStakingContract({
      chainInfo: this._hubChainInfo,
      address: stakingContractAddress,
    })

    // Get all bucket info and sum the staked amounts
    const allBucketInfo = await stakingContract.getAllBucketInfo()
    const [, , stakedAmounts] = allBucketInfo

    // Sum all staked amounts across buckets
    const totalStaked = stakedAmounts.reduce((acc, amount) => acc + amount, 0n)

    return totalStaked
  }

  async getStakingRevenueShareV2(): ReturnType<
    IArmadaManagerGovernance['getStakingRevenueShareV2']
  > {
    const percentage = Percentage.createFrom({ value: 20 })
    const totalRevenue = await this._vaults.getProtocolRevenue()
    console.log({
      totalRevenue,
      percentage: percentage.toProportion(),
    })
    const amount = totalRevenue * percentage.toProportion()

    return { percentage, amount }
  }
}
